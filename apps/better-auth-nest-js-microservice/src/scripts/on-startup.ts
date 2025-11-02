import { Match, Option, Effect, pipe } from 'effect';
import * as ReadonlyArray from 'effect/Array';
import { hashPassword } from 'better-auth/crypto';
import { PrismaClient } from '../../better-auth-db/prisma/generated/client/index.js';
import { resolve } from 'node:path';
import { promises as fs } from 'node:fs';

const ENV_FILE_PATH = resolve(
	process.cwd(),
	'apps/better-auth-nest-js-microservice/.env'
);

interface SeedAdminUser {
	readonly id: string;
	readonly email: string;
	readonly username: string;
	readonly name: string;
	readonly password: string;
}

interface SeedAdminUsersConfig {
	readonly seeds: ReadonlyArray<SeedAdminUser>;
	readonly missingPrefixes: ReadonlyArray<string>;
}

interface SeedAdminUserDescriptor {
	readonly prefix: string;
	readonly name: string;
}

class AdminSeedError extends Error {
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.cause = cause;
	}
}

class EnvironmentLoadFailure extends AdminSeedError {
	constructor(message: string, cause?: unknown) {
		super(message, cause);
	}
}

class PasswordHashFailure extends AdminSeedError {
	constructor(message: string, cause?: unknown) {
		super(message, cause);
	}
}

class AdminUserPersistenceFailure extends AdminSeedError {
	constructor(userId: string, cause?: unknown) {
		super(`Failed to persist admin user with id "${userId}"`, cause);
	}
}

class PrismaDisconnectFailure extends AdminSeedError {
	constructor(message: string, cause?: unknown) {
		super(message, cause);
	}
}

const SEED_ADMIN_USER_DESCRIPTORS: ReadonlyArray<SeedAdminUserDescriptor> = [
	{
		prefix: 'BETTER_AUTH_NEST_JS_MICROSERVICE',
		name: 'Better Auth NestJS Microservice Admin',
	},
	{
		prefix: 'BETTER_AUTH_NEXT_JS_FRONTEND',
		name: 'Better Auth Next.js Frontend Admin',
	},
];

/**
 * Safely loads the local environment file when the Node.js runtime supports it.
 *
 * @returns {Effect.Effect<void, EnvironmentLoadFailure, never>} Effect describing the optional env load.
 */
const loadEnvironmentFile = (): Effect.Effect<void, EnvironmentLoadFailure, never> =>
	pipe(
		Option.fromNullable<typeof process.loadEnvFile>(process.loadEnvFile),
		Option.match({
			onNone: () =>
				pipe(
					Effect.tryPromise({
						try: () => fs.readFile(ENV_FILE_PATH, 'utf-8'),
						catch: (error) =>
							new EnvironmentLoadFailure('Failed to load Better Auth environment file.', error),
					}),
					Effect.flatMap((content) =>
						Effect.forEach(parseEnvContent(content), (entry) =>
							Effect.sync(() => {
								if (!(entry.key in process.env)) {
									process.env[entry.key] = entry.value;
								}
							}),
						{ concurrency: 'unbounded', discard: true }
						)
					)
				),
			onSome: (loadEnvFile) =>
				Effect.try({
					try: () => loadEnvFile(ENV_FILE_PATH),
					catch: (error) =>
						new EnvironmentLoadFailure('Failed to load Better Auth environment file.', error),
				}),
		})
	);

interface ParsedEnvEntry {
	readonly key: string;
	readonly value: string;
}

/**
 * Parses raw .env content into individual environment entries.
 *
 * @pure Converts dotenv-formatted text into key/value entries.
 * @fp-pattern ReadonlyArray.filterMap for optional parsing of each line.
 * @composition
 *   - `pipe(content.split(/\r?\n/), ReadonlyArray.filterMap(parseEnvLine))`
 *
 * @param content - Raw dotenv file content.
 * @returns Parsed environment entries.
 */
const parseEnvContent = (content: string): ReadonlyArray<ParsedEnvEntry> =>
	pipe(
		content.split(/\r?\n/),
		ReadonlyArray.filterMap(parseEnvLine)
	);

/**
 * Parses an individual dotenv line into a key/value entry when possible.
 *
 * @pure Extracts environment metadata from a single dotenv line.
 * @fp-pattern Option.fromNullable with structural validation.
 *
 * @param line - dotenv line to parse.
 * @returns Option containing a parsed environment entry.
 */
const parseEnvLine = (line: string): Option.Option<ParsedEnvEntry> =>
	pipe(
		Option.fromNullable(line.trim()),
		Option.filter((trimmed) => trimmed.length > 0 && !trimmed.startsWith('#')),
		Option.flatMap((trimmed) =>
			pipe(
				optionFromPredicate(trimmed.indexOf('='), (separatorIndex) => separatorIndex > 0),
				Option.map((separatorIndex) => ({
					key: trimmed.slice(0, separatorIndex).trim(),
					value: normalizeEnvValue(trimmed.slice(separatorIndex + 1)),
				}))
			)
		)
	);

/**
 * Normalizes dotenv values by stripping surrounding quotes when present.
 *
 * @pure Ensures environment values are stored without surrounding quotes.
 * @fp-pattern Pattern matching with Option for quote handling.
 *
 * @param value - Raw dotenv value string.
 * @returns Normalized environment value.
 */
const normalizeEnvValue = (value: string): string =>
	pipe(
		Option.fromNullable(value.trim()),
		Option.map((trimmed) =>
			pipe(
				optionFromPredicate(trimmed, (input) =>
					input.length >= 2 && input.startsWith('"') && input.endsWith('"')
				),
				Option.orElse(() =>
					optionFromPredicate(trimmed, (input) =>
						input.length >= 2 && input.startsWith("'") && input.endsWith("'")
					)
				),
				Option.map((quoted) => quoted.slice(1, -1)),
				Option.getOrElse(() => trimmed)
			)
		),
		Option.getOrElse(() => value.trim())
	);

/**
 * Wraps a value in an Option when it satisfies the provided predicate.
 *
 * @pure Lifts predicate checks into the Option context.
 * @fp-pattern Predicate lifting to Option.some/Option.none.
 *
 * @param value - Value to test.
 * @param predicate - Predicate determining presence.
 * @returns Option containing the value when the predicate passes.
 */
const optionFromPredicate = <A>(
	value: A,
	predicate: (value: A) => boolean
): Option.Option<A> => (predicate(value) ? Option.some(value) : Option.none());

/**
 * Reads an environment variable and returns it as an Option.
 *
 * @pure Extracts a present, non-empty environment value.
 * @fp-pattern Option combinator for environment access.
 *
 * @param key - Environment variable identifier.
 * @returns Present Option when the environment value exists.
 */
const readEnvValue = (key: string): Option.Option<string> =>
	pipe(
		Option.fromNullable(process.env[key]),
		Option.filter((value) => value.trim().length > 0)
	);

/**
 * Builds a seed admin user from the configured environment variables.
 *
 * @pure Creates a seed descriptor when all required env variables exist.
 * @fp-pattern Option.all for aggregating optional values.
 *
 * @param descriptor - Admin seed descriptor metadata.
 * @returns Configured admin seed when all environment values are available.
 */
const buildSeedAdminUser = (
	descriptor: SeedAdminUserDescriptor
): Option.Option<SeedAdminUser> =>
	pipe(
		Option.all({
			id: readEnvValue(`${descriptor.prefix}_USER_ID`),
			email: readEnvValue(`${descriptor.prefix}_EMAIL`),
			password: readEnvValue(`${descriptor.prefix}_PASSWORD`),
			username: readEnvValue(`${descriptor.prefix}_USERNAME`),
		}),
		Option.map(({ id, email, password, username }) => ({
			id,
			email,
			password,
			username,
			name: descriptor.name,
		}))
	);

/**
 * Collects the configured seed admin users and missing descriptor prefixes.
 *
 * @pure Aggregates seed metadata and missing configuration markers.
 * @fp-pattern ReadonlyArray reduction with Option-driven branching.
 * @composition
 *   - `pipe(SEED_ADMIN_USER_DESCRIPTORS, RA.reduce(...))`
 *
 * @returns {SeedAdminUsersConfig} Seed collection and missing prefix list.
 */
const getSeedAdminUsersConfig = (): SeedAdminUsersConfig =>
	pipe(
		SEED_ADMIN_USER_DESCRIPTORS,
		ReadonlyArray.reduce(
			{ seeds: [] as ReadonlyArray<SeedAdminUser>, missingPrefixes: [] as ReadonlyArray<string> },
			(accumulator, descriptor) =>
				pipe(
					buildSeedAdminUser(descriptor),
					Option.match({
						onNone: () => ({
							seeds: accumulator.seeds,
							missingPrefixes: [...accumulator.missingPrefixes, descriptor.prefix],
						}),
						onSome: (seed) => ({
							seeds: [...accumulator.seeds, seed],
							missingPrefixes: accumulator.missingPrefixes,
						}),
					})
			)
		)
	);

/**
 * Creates a deterministic identifier for the seeded credential account.
 *
 * @pure Generates credential identifiers derived from the user id.
 * @fp-pattern Deterministic string composition.
 *
 * @param seed - Seed admin user metadata.
 * @returns Credential identifier for the Prisma Account record.
 */
const createCredentialId = (seed: SeedAdminUser): string => `${seed.id}-credential`;

/**
 * Hashes a plaintext password using Better Auth's hashing utility.
 *
 * @description Provides a typed Effect around the Better Auth password hasher.
 *
 * @param password - Raw password to hash.
 * @returns {Effect.Effect<string, PasswordHashFailure, never>} Effect yielding the hashed password.
 */
const hashAdminPassword = (
	password: string
): Effect.Effect<string, PasswordHashFailure, never> =>
	Effect.tryPromise({
		try: () => hashPassword(password),
		catch: (error) => new PasswordHashFailure('Failed to hash admin user password.', error),
	});

/**
 * Persists the admin user and its credential account inside a transaction.
 *
 * @description Upserts both the user and credential account rows for the supplied seed.
 *
 * @param prisma - Prisma client instance.
 * @param seed - Seed admin user metadata.
 * @param hashedPassword - Hashed password for the credential account.
 * @returns {Effect.Effect<void, AdminUserPersistenceFailure, never>} Effect describing the persistence workflow.
 */
const persistAdminUser = (
	prisma: PrismaClient,
	seed: SeedAdminUser,
	hashedPassword: string
): Effect.Effect<void, AdminUserPersistenceFailure, never> =>
	Effect.tryPromise({
		try: () =>
			prisma.$transaction(async (tx) => {
				await tx.user.upsert({
					where: { id: seed.id },
					update: {
						email: seed.email,
						name: seed.name,
						username: seed.username,
						displayUsername: seed.username,
						emailVerified: true,
						role: 'admin',
						banned: false,
						banReason: null,
						banExpires: null,
					},
					create: {
						id: seed.id,
						email: seed.email,
						name: seed.name,
						username: seed.username,
						displayUsername: seed.username,
						emailVerified: true,
						role: 'admin',
						banned: false,
						banReason: null,
						banExpires: null,
					},
				});

				await tx.account.upsert({
					where: { id: createCredentialId(seed) },
					update: {
						accountId: seed.email,
						providerId: 'credential',
						password: hashedPassword,
					},
					create: {
						id: createCredentialId(seed),
						accountId: seed.email,
						providerId: 'credential',
						userId: seed.id,
						password: hashedPassword,
					},
				});
			}),
		catch: (error) => new AdminUserPersistenceFailure(seed.id, error),
	});

/**
 * Ensures that the given admin seed user exists within the datastore.
 *
 * @description Hashes the password, upserts the user and credential account, and logs success.
 *
 * @param prisma - Prisma client instance.
 * @param seed - Seed admin user metadata.
 * @returns {Effect.Effect<void, AdminSeedError, never>} Effect describing the seeding of a single admin user.
 */
const ensureAdminUser = (
	prisma: PrismaClient,
	seed: SeedAdminUser
): Effect.Effect<void, AdminSeedError, never> =>
	pipe(
		hashAdminPassword(seed.password),
		Effect.flatMap((hashedPassword) => persistAdminUser(prisma, seed, hashedPassword)),
		Effect.tap(() =>
			Effect.sync(() =>
				console.log(`[better-auth] Seeded administrator account for ${seed.email}.`)
			)
		)
	);

/**
 * Seeds the configured admin users using a scoped Prisma client.
 *
 * @description Creates a Prisma client, ensures each admin user exists, and disconnects afterwards.
 *
 * @param seeds - Collection of admin seed users.
 * @returns {Effect.Effect<void, AdminSeedError, never>} Effect describing the scoped seeding workflow.
 */
const seedAdminUsers = (
	seeds: ReadonlyArray<SeedAdminUser>
): Effect.Effect<void, AdminSeedError, never> =>
	Effect.scoped(
		pipe(
			Effect.acquireRelease(
				Effect.sync(() => new PrismaClient()),
				(prisma) =>
						pipe(
							Effect.promise(() => prisma.$disconnect()),
							Effect.orDieWith((error) =>
								new PrismaDisconnectFailure('Failed to disconnect Prisma client.', error)
							)
						)
			),
			Effect.flatMap((prisma) =>
				Effect.forEach(seeds, (seed) => ensureAdminUser(prisma, seed), {
					concurrency: 'unbounded',
					discard: true,
				})
			)
		)
	);

const mainProgram = pipe(
	loadEnvironmentFile(),
	Effect.flatMap(() => {
		const config = getSeedAdminUsersConfig();

		return pipe(
			Effect.forEach(config.missingPrefixes, (prefix) =>
				Effect.sync(() =>
					console.warn(
						`[better-auth] Skipping admin seed for prefix "${prefix}" because required environment variables are missing.`
					)
				),
				{ concurrency: 'unbounded', discard: true }
			),
			Effect.flatMap(() =>
				Match.value(config.seeds.length).pipe(
					Match.when(0, () =>
						Effect.sync(() =>
							console.log('[better-auth] No admin seed users configured; skipping seeding workflow.')
						)
					),
					Match.orElse(() =>
						pipe(
							seedAdminUsers(config.seeds),
							Effect.tap(() =>
								Effect.sync(() =>
									console.log('[better-auth] Completed admin user seeding workflow.')
								)
							)
						)
					)
				)
			)
		);
	})
);

void Effect.runPromise(mainProgram).then(
	() => {
		console.log('[better-auth] Admin on-startup script completed successfully.');
	},
	(error) => {
		console.error('[better-auth] Admin on-startup script failed.', error);
		process.exitCode = 1;
	}
);
