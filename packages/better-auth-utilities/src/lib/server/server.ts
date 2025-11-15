/**
 * @file libs/better-auth-utilities/src/lib/server.ts
 * @description Server-side better-auth instance creation with full plugin support.
 */

import { betterAuth } from 'better-auth';
import type { BetterAuthOptions } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import {
	apiKey,
	bearer,
	jwt,
	openAPI,
	twoFactor,
	admin,
	organization,
	username,
	magicLink,
	siwe,
	genericOAuth,
	oneTap,
	anonymous,
	phoneNumber,
	emailOTP,
	deviceAuthorization,
	lastLoginMethod,
	oneTimeToken,
	multiSession,
} from 'better-auth/plugins';
import type { BetterAuthConfig, AvailablePlugins } from '../config/config.js';

// ============================================================================
// PLUGIN FACTORY FUNCTIONS
// ============================================================================

/**
 * Maps plugin names to their factory functions with configurations.
 * Each plugin returns a different type, so we use `any` for flexibility.
 */
const PLUGIN_FACTORIES: Record<
	AvailablePlugins,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(config?: unknown) => any
> = {
	// Core authentication plugins
	username: (config) => username(config as Parameters<typeof username>[0]),
	magicLink: (config) => magicLink(config as Parameters<typeof magicLink>[0]),
	twoFactor: (config) => twoFactor(config as Parameters<typeof twoFactor>[0]),
	admin: (config) => admin(config as Parameters<typeof admin>[0]),
	organization: (config) => organization(config as Parameters<typeof organization>[0]),
	passkey: () => {
		throw new Error('Passkey plugin requires @better-auth/passkey package or correct import path');
	},

	// OAuth/Auth plugins
	oidc: () => {
		throw new Error('OIDC plugin requires correct import or @better-auth/oidc package');
	},
	siwe: (config) => siwe(config as Parameters<typeof siwe>[0]),
	genericOAuth: (config) => genericOAuth(config as Parameters<typeof genericOAuth>[0]),
	oneTap: (config) => oneTap(config as Parameters<typeof oneTap>[0]),

	// Integration plugins (these would need the actual packages installed)
	stripe: () => {
		throw new Error('Stripe plugin requires @better-auth/stripe package');
	},
	polar: () => {
		throw new Error('Polar plugin requires @polar-sh/better-auth package');
	},
	dodopayments: () => {
		throw new Error('Dodo Payments plugin requires @dodopayments/better-auth package');
	},
	dubAnalytics: () => {
		throw new Error('Dub Analytics plugin requires @dub/better-auth package');
	},

	// Security plugins
	bearer: (config) => bearer(config as Parameters<typeof bearer>[0]),
	jwt: (config) => jwt(config as Parameters<typeof jwt>[0]),
	apiKey: (config) => apiKey(config as Parameters<typeof apiKey>[0]),
	haveIBeenPwned: () => {
		throw new Error('Have I Been Pwned plugin requires @better-auth/hibp package');
	},

	// Advanced plugins
	multiSession: (config) => multiSession(config as Parameters<typeof multiSession>[0]),
	anonymous: (config) => anonymous(config as Parameters<typeof anonymous>[0]),
	phoneNumber: (config) => phoneNumber(config as Parameters<typeof phoneNumber>[0]),
	emailOTP: (config) => emailOTP(config as Parameters<typeof emailOTP>[0]),
	deviceAuthorization: (config) => deviceAuthorization(config as Parameters<typeof deviceAuthorization>[0]),
	lastLoginMethod: (config) => lastLoginMethod(config as Parameters<typeof lastLoginMethod>[0]),
	oneTimeToken: (config) => oneTimeToken(config as Parameters<typeof oneTimeToken>[0]),
};

// ============================================================================
// SERVER INSTANCE CREATION
// ============================================================================

/**
 * Creates a fully configured better-auth server instance from a BetterAuthConfig.
 *
 * This factory function:
 * - Takes a type-safe configuration object
 * - Initializes all enabled plugins with their configurations
 * - Configures the database adapter (Prisma by default)
 * - Sets up OAuth providers, email/password auth, sessions, and rate limiting
 * - Returns a ready-to-use better-auth server instance
 *
 * @template ServerPlugins - Array of plugin names enabled on the server
 * @template ClientPlugins - Array of plugin names enabled on the client
 *
 * @param config - Complete better-auth configuration
 * @param prismaClient - Prisma client instance for database operations
 * @returns Configured better-auth server instance
 *
 * @example
 * ```typescript
 * import { PrismaClient } from '@prisma/client';
 * import { createAuthServer } from '@/lib/better-auth-utilities';
 * import { authConfig } from '@/config/auth.config';
 *
 * const prisma = new PrismaClient();
 *
 * export const auth = createAuthServer(authConfig, prisma);
 *
 * // Type-safe API usage
 * const session = await auth.api.getSession({ headers });
 * const apiKeyResult = await auth.api.createApiKey({ body: { name: 'My Key' } });
 * ```
 */
export function createAuthServer<ServerPlugins extends readonly AvailablePlugins[] = [], ClientPlugins extends readonly AvailablePlugins[] = ServerPlugins>(
	config: BetterAuthConfig<ServerPlugins, ClientPlugins>,
	prismaClient: unknown // Type as unknown to avoid Prisma dependency in this file
): ReturnType<typeof betterAuth> {
	// Collect enabled plugins
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const plugins: any[] = [];

	// Always add OpenAPI plugin for documentation
	plugins.push(openAPI());

	// Add enabled server plugins
	const enabledPlugins = config.enabledServerPlugins || ([] as readonly AvailablePlugins[]);

	for (const pluginName of enabledPlugins) {
		const factory = PLUGIN_FACTORIES[pluginName];
		if (!factory) {
			console.warn(`Unknown plugin: ${pluginName}`);
			continue;
		}

		try {
			// Get plugin configuration from server.plugins
			const pluginConfig = config.server.plugins?.[pluginName];
			const plugin = factory(pluginConfig);
			plugins.push(plugin);
		} catch (error) {
			console.error(`Failed to initialize plugin ${pluginName}:`, error);
			// Don't throw - allow partial plugin initialization
		}
	}

	// Build better-auth options
	const authOptions: BetterAuthOptions = {
		appName: config.server.appName || 'My Application',
		baseURL: config.server.baseURL || process.env.BETTER_AUTH_URL || 'http://localhost:3000',
		secret: config.server.secret,

		// Database configuration with Prisma adapter
		database: config.server.database
			? config.server.database
			: prismaAdapter(prismaClient as never, {
					provider: 'postgresql', // This should be configurable
				}),

		// Email and password configuration
		emailAndPassword: config.server.emailAndPassword
			? {
					enabled: config.server.emailAndPassword.enabled ?? true,
					minPasswordLength: config.server.emailAndPassword.minPasswordLength,
					requireEmailVerification: config.server.emailAndPassword.requireEmailVerification,
					sendResetPassword: config.server.emailAndPassword.sendResetPassword,
				}
			: {
					enabled: true,
					minPasswordLength: 8,
					requireEmailVerification: false,
				},

		// Email verification
		emailVerification: config.server.emailVerification,

		// OAuth social providers - cast to any to handle type mismatch
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		socialProviders: (config.server.socialProviders || []) as any,

		// Session configuration
		session: {
			expiresIn: config.server.session?.expiresIn || 60 * 60 * 24 * 7, // 7 days
			updateAge: config.server.session?.updateAge || 60 * 60 * 24, // 1 day
			freshAge: config.server.session?.freshAge || 60 * 10, // 10 minutes
		},

		// Rate limiting
		rateLimit: config.server.rateLimit || {
			enabled: true,
			window: 60,
			max: 10,
		},

		// Trusted origins for CORS
		trustedOrigins: config.server.trustedOrigins || [],

		// Add all plugins
		plugins,
	};

	return betterAuth(authOptions);
}

/**
 * Resolves the canonical Better Auth server instance returned by {@link betterAuth}.
 *
 * @remarks Consumers typically import this alias and pair it with {@link createAuthServer}
 * to share a single source of truth, as shown in `packages/prisma/better-auth-db/src/lib/auth/auth.ts`.
 */
export type AuthServer = ReturnType<typeof betterAuth>;

/**
 * Narrows the inferred Better Auth server created by {@link createAuthServer}.
 *
 * @typeParam TAuthServer - The concrete server instance produced by `createAuthServer`.
 *
 * @example
 * ```typescript
 * import { createAuthServer } from '@emperorrag/better-auth-utilities/server';
 * import type { AuthServerOf } from '@emperorrag/better-auth-utilities/server';
 *
 * export const authServer = createAuthServer(config, prisma);
 * export type AuthServer = AuthServerOf<typeof authServer>;
 * ```
 */
export type AuthServerOf<TAuthServer extends AuthServer> = TAuthServer;

/**
 * Extracts the strongly typed Better Auth API surface from a server instance.
 *
 * @typeParam TAuthServer - The Better Auth server whose `api` contract should be exposed.
 *
 * @example
 * ```typescript
 * import type { AuthServerApiOf } from '@emperorrag/better-auth-utilities/server';
 *
 * type AuthServerApi = AuthServerApiOf<AuthServer>;
 * ```
 */
export type AuthServerApiOf<TAuthServer extends AuthServer> = TAuthServer['api'];

/**
 * Enumerates valid endpoint keys for a Better Auth server API.
 *
 * @typeParam TAuthServer - The Better Auth server whose endpoint keys are required.
 *
 * @example
 * ```typescript
 * import type { AuthServerApiEndpointKeyOf } from '@emperorrag/better-auth-utilities/server';
 *
 * type EndpointKey = AuthServerApiEndpointKeyOf<AuthServer>;
 * ```
 */
export type AuthServerApiEndpointKeyOf<TAuthServer extends AuthServer> = keyof AuthServerApiOf<TAuthServer>;

/**
 * Resolves the endpoint signature for a specific Better Auth API key.
 *
 * @typeParam TAuthServer - The Better Auth server instance providing the API.
 *
 * @example
 * ```typescript
 * import type { AuthServerApiEndpointOf } from '@emperorrag/better-auth-utilities/server';
 *
 * type AnyEndpoint = AuthServerApiEndpointOf<AuthServer>;
 * ```
 */
export type AuthServerApiEndpointOf<TAuthServer extends AuthServer> = AuthServerApiOf<TAuthServer>[AuthServerApiEndpointKeyOf<TAuthServer>];

/**
 * Retrieves the full parameter tuple for a concrete Better Auth API endpoint.
 *
 * @typeParam TAuthServer - The Better Auth server instance supplying the API.
 * @typeParam TEndpointKey - The endpoint key whose parameter tuple should be inferred.
 *
 * @example
 * ```typescript
 * import type { AuthServerApiEndpointParametersOf } from '@emperorrag/better-auth-utilities/server';
 *
 * type GetSessionParams = AuthServerApiEndpointParametersOf<AuthServer, 'getSession'>;
 * ```
 */
export type AuthServerApiEndpointParametersOf<
	TAuthServer extends AuthServer,
	TEndpointKey extends AuthServerApiEndpointKeyOf<TAuthServer>,
> = AuthServerApiOf<TAuthServer>[TEndpointKey] extends (...args: infer TParameters) => unknown ? TParameters : never;

/**
 * Picks the first argument accepted by a Better Auth API endpoint.
 *
 * @typeParam TAuthServer - The Better Auth server instance supplying the API.
 * @typeParam TEndpointKey - The endpoint key whose first argument should be inferred.
 *
 * @example
 * ```typescript
 * import type { AuthServerApiEndpointFirstParameter } from '@emperorrag/better-auth-utilities/server';
 *
 * type SignInArgs = AuthServerApiEndpointFirstParameter<AuthServer, 'signInEmail'>;
 * ```
 */
export type AuthServerApiEndpointFirstParameter<TAuthServer extends AuthServer, TEndpointKey extends AuthServerApiEndpointKeyOf<TAuthServer>> =
	AuthServerApiEndpointParametersOf<TAuthServer, TEndpointKey> extends [infer TFirst, ...unknown[]] ? TFirst : never;

/**
 * Extracts the request body contract for a Better Auth API endpoint.
 *
 * @typeParam TAuthServer - The Better Auth server supplying the API contract.
 * @typeParam TEndpointKey - The endpoint key whose request body should be inferred.
 *
 * @example
 * ```typescript
 * import type { AuthServerApiEndpointBody } from '@emperorrag/better-auth-utilities/server';
 *
 * type SignUpBody = AuthServerApiEndpointBody<AuthServer, 'signUpEmail'>;
 * ```
 */
export type AuthServerApiEndpointBody<TAuthServer extends AuthServer, TEndpointKey extends AuthServerApiEndpointKeyOf<TAuthServer>> =
	AuthServerApiEndpointFirstParameter<TAuthServer, TEndpointKey> extends { body: infer TBody } ? TBody : never;

export type AuthServerEndpointBodyFor<TAuthServer extends AuthServer, TKey extends string> =
	Extract<AuthServerApiEndpointKeyOf<TAuthServer>, TKey> extends infer TMapped
		? TMapped extends AuthServerApiEndpointKeyOf<TAuthServer>
			? AuthServerApiEndpointBody<TAuthServer, TMapped>
			: never
		: never;

/**
 * Type helper to infer session type from the typeof server instance.
 *
 * @example
 * ```typescript
 * const auth = createAuthServer(authConfig, prisma);
 * export type Session = AuthServerSessionOf<typeof auth>;
 * ```
 */
/**
 * Infers the Better Auth session payload, including plugin augmentations, from a server instance.
 *
 * @typeParam TAuth - The Better Auth server from which to derive the session structure.
 *
 * @example
 * ```typescript
 * import type { AuthServerSessionOf } from '@emperorrag/better-auth-utilities/server';
 *
 * type AuthServerSession = AuthServerSessionOf<AuthServer>;
 * ```
 */
export type AuthServerSessionOf<TAuth extends AuthServer> = TAuth['$Infer']['Session'];

/**
 * Extracts the raw session record embedded inside {@link AuthServerSessionOf}.
 *
 * @typeParam TAuth - The Better Auth server whose session record should be exposed.
 *
 * @example
 * ```typescript
 * import type { AuthServerSessionUserSessionOf } from '@emperorrag/better-auth-utilities/server';
 *
 * type SessionRecord = AuthServerSessionUserSessionOf<AuthServer>;
 * ```
 */
export type AuthServerSessionUserSessionOf<TAuth extends AuthServer> = TAuth['$Infer']['Session']['session'];

/**
 * Extracts the user profile representation embedded in the Better Auth session.
 *
 * @typeParam TAuth - The Better Auth server whose user payload should be exposed.
 *
 * @example
 * ```typescript
 * import type { AuthServerSessionUserOf } from '@emperorrag/better-auth-utilities/server';
 *
 * type SessionUser = AuthServerSessionUserOf<AuthServer>;
 * ```
 */
export type AuthServerSessionUserOf<TAuth extends AuthServer> = TAuth['$Infer']['Session']['user'];
