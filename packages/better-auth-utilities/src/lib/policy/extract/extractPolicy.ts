/**
 * Atomic Actions for Policy Extraction:
 *
 * 1. Extract Auth Options
 *    - Input: `AuthServer` instance
 *    - Action: Access the `options` property from the `AuthServer` instance.
 *    - Output: `BetterAuthOptions` object (or undefined).
 *
 * 2. Extract Email & Password Configuration
 *    - Input: `BetterAuthOptions`
 *    - Action: Access the `emailAndPassword` property.
 *    - Output: Email and password configuration object (or undefined).
 *
 * 3. Extract Minimum Password Length
 *    - Input: Email and password configuration
 *    - Action: Access `minPasswordLength`.
 *    - Logic: If undefined, default to 8.
 *    - Output: `number`.
 *
 * 4. Extract Maximum Password Length
 *    - Input: Email and password configuration
 *    - Action: Access `maxPasswordLength`.
 *    - Logic: If undefined, default to 32.
 *    - Output: `number`.
 *
 * 5. Construct Password Policy
 *    - Input: Min and Max lengths
 *    - Action: Create a `PasswordPolicy` object.
 *    - Output: `{ minLength: number; maxLength: number }`.
 *
 * 6. Construct Global Policy
 *    - Input: `PasswordPolicy` (and future sub-policies)
 *    - Action: Aggregate into a single `Policy` object.
 *    - Output: `Policy` object.
 */

import * as Effect from 'effect/Effect';
import { pipe } from 'effect/Function';
import * as Option from 'effect/Option';
import type { AuthServer } from '../../server/server.types';

export type PasswordPolicy = {
	readonly minLength: number;
	readonly maxLength: number;
};

export type Policy = {
	readonly password: PasswordPolicy;
	readonly secret: Option.Option<string>;
	readonly baseURL: Option.Option<string>;
	readonly basePath: string;
	readonly database: Option.Option<NonNullable<AuthOptions>['database']>;
	readonly session: Option.Option<NonNullable<AuthOptions>['session']>;
	readonly cookies: Option.Option<NonNullable<AuthOptions>['advanced']>;
	readonly trustedOrigins: Option.Option<NonNullable<AuthOptions>['trustedOrigins']>;
	readonly socialProviders: Option.Option<NonNullable<AuthOptions>['socialProviders']>;
	readonly user: Option.Option<NonNullable<AuthOptions>['user']>;
	readonly plugins: Option.Option<NonNullable<AuthOptions>['plugins']>;
	readonly logger: Option.Option<NonNullable<AuthOptions>['logger']>;
};

type AuthOptions = AuthServer['options'];
type EmailAndPasswordConfig = NonNullable<AuthOptions>['emailAndPassword'];

/**
 * Helper to extract a property from an Option wrapped object.
 *
 * @param input - The object wrapped in Option.
 * @param selector - A function to select the property from the object.
 * @returns {Effect.Effect<Option.Option<TOutput>>} The selected property wrapped in Option and Effect.
 */
const extractProperty = <TInput, TOutput>(
	input: Option.Option<TInput>,
	selector: (input: TInput) => TOutput | undefined | null
): Effect.Effect<Option.Option<TOutput>> =>
	Effect.sync(() =>
		pipe(
			input,
			Option.flatMap((i) => Option.fromNullable(selector(i)))
		)
	);

/**
 * Extracts the options from the AuthServer instance.
 *
 * @param server - The AuthServer instance.
 * @returns {Effect.Effect<Option.Option<AuthOptions>>} The options wrapped in Option.
 */
export const extractAuthOptions = (server: AuthServer): Effect.Effect<Option.Option<AuthOptions>> => Effect.sync(() => Option.fromNullable(server.options));

/**
 * Extracts the email and password configuration from the options.
 *
 * @param options - The AuthOptions wrapped in Option.
 * @returns {Effect.Effect<Option.Option<EmailAndPasswordConfig>>} The configuration wrapped in Option.
 */
export const extractEmailAndPasswordConfig = (options: Option.Option<AuthOptions>): Effect.Effect<Option.Option<EmailAndPasswordConfig>> =>
	extractProperty(options, (opts) => opts?.emailAndPassword);

/**
 * Extracts the minimum password length from the configuration.
 *
 * @param config - The EmailAndPasswordConfig wrapped in Option.
 * @returns {Effect.Effect<number>} The minimum password length (defaults to 8).
 */
export const extractMinPasswordLength = (config: Option.Option<EmailAndPasswordConfig>): Effect.Effect<number> =>
	pipe(
		extractProperty(config, (c) => c?.minPasswordLength),
		Effect.map(Option.getOrElse(() => 8))
	);

/**
 * Extracts the maximum password length from the configuration.
 *
 * @param config - The EmailAndPasswordConfig wrapped in Option.
 * @returns {Effect.Effect<number>} The maximum password length (defaults to 32).
 */
export const extractMaxPasswordLength = (config: Option.Option<EmailAndPasswordConfig>): Effect.Effect<number> =>
	pipe(
		extractProperty(config, (c) => c?.maxPasswordLength),
		Effect.map(Option.getOrElse(() => 32))
	);

/**
 * Constructs the password policy from min and max lengths.
 *
 * @param inputs - The min and max lengths.
 * @returns {Effect.Effect<PasswordPolicy>} The password policy.
 */
export const constructPasswordPolicy = (inputs: { minLength: number; maxLength: number }): Effect.Effect<PasswordPolicy> =>
	Effect.succeed({
		minLength: inputs.minLength,
		maxLength: inputs.maxLength,
	});

/**
 * Extracts the secret from the options.
 */
export const extractSecret = (options: Option.Option<AuthOptions>): Effect.Effect<Option.Option<string>> => extractProperty(options, (opts) => opts?.secret);

/**
 * Extracts the baseURL from the options.
 */
export const extractBaseURL = (options: Option.Option<AuthOptions>): Effect.Effect<Option.Option<string>> => extractProperty(options, (opts) => opts?.baseURL);

/**
 * Extracts the basePath from the options.
 */
export const extractBasePath = (options: Option.Option<AuthOptions>): Effect.Effect<string> =>
	pipe(
		extractProperty(options, (opts) => opts?.basePath),
		Effect.map(Option.getOrElse(() => '/api/auth'))
	);

/**
 * Extracts the database configuration from the options.
 */
export const extractDatabase = (options: Option.Option<AuthOptions>): Effect.Effect<Option.Option<NonNullable<AuthOptions>['database']>> =>
	extractProperty(options, (opts) => opts?.database);

/**
 * Extracts the session configuration from the options.
 */
export const extractSession = (options: Option.Option<AuthOptions>): Effect.Effect<Option.Option<NonNullable<AuthOptions>['session']>> =>
	extractProperty(options, (opts) => opts?.session);

/**
 * Extracts the cookies configuration from the options.
 */
export const extractCookies = (options: Option.Option<AuthOptions>): Effect.Effect<Option.Option<NonNullable<AuthOptions>['advanced']>> =>
	extractProperty(options, (opts) => (opts?.advanced?.cookies ? opts.advanced : undefined));

/**
 * Extracts the trustedOrigins from the options.
 */
export const extractTrustedOrigins = (options: Option.Option<AuthOptions>): Effect.Effect<Option.Option<NonNullable<AuthOptions>['trustedOrigins']>> =>
	extractProperty(options, (opts) => opts?.trustedOrigins);

/**
 * Extracts the socialProviders from the options.
 */
export const extractSocialProviders = (options: Option.Option<AuthOptions>): Effect.Effect<Option.Option<NonNullable<AuthOptions>['socialProviders']>> =>
	extractProperty(options, (opts) => opts?.socialProviders);

/**
 * Extracts the user configuration from the options.
 */
export const extractUser = (options: Option.Option<AuthOptions>): Effect.Effect<Option.Option<NonNullable<AuthOptions>['user']>> =>
	extractProperty(options, (opts) => opts?.user);

/**
 * Extracts the plugins from the options.
 */
export const extractPlugins = (options: Option.Option<AuthOptions>): Effect.Effect<Option.Option<NonNullable<AuthOptions>['plugins']>> =>
	extractProperty(options, (opts) => opts?.plugins);

/**
 * Extracts the logger from the options.
 */
export const extractLogger = (options: Option.Option<AuthOptions>): Effect.Effect<Option.Option<NonNullable<AuthOptions>['logger']>> =>
	extractProperty(options, (opts) => opts?.logger);

/**
 * Constructs the global policy from the password policy.
 *
 * @param inputs - The inputs for the global policy.
 * @returns {Effect.Effect<Policy>} The global policy.
 */
export const constructGlobalPolicy = (inputs: {
	password: PasswordPolicy;
	secret: Option.Option<string>;
	baseURL: Option.Option<string>;
	basePath: string;
	database: Option.Option<NonNullable<AuthOptions>['database']>;
	session: Option.Option<NonNullable<AuthOptions>['session']>;
	cookies: Option.Option<NonNullable<AuthOptions>['advanced']>;
	trustedOrigins: Option.Option<NonNullable<AuthOptions>['trustedOrigins']>;
	socialProviders: Option.Option<NonNullable<AuthOptions>['socialProviders']>;
	user: Option.Option<NonNullable<AuthOptions>['user']>;
	plugins: Option.Option<NonNullable<AuthOptions>['plugins']>;
	logger: Option.Option<NonNullable<AuthOptions>['logger']>;
}): Effect.Effect<Policy> =>
	Effect.succeed({
		password: inputs.password,
		secret: inputs.secret,
		baseURL: inputs.baseURL,
		basePath: inputs.basePath,
		database: inputs.database,
		session: inputs.session,
		cookies: inputs.cookies,
		trustedOrigins: inputs.trustedOrigins,
		socialProviders: inputs.socialProviders,
		user: inputs.user,
		plugins: inputs.plugins,
		logger: inputs.logger,
	});
