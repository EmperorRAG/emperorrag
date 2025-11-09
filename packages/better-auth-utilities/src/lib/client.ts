/**
 * @file libs/better-auth-utilities/src/lib/client.ts
 * @description Client-side better-auth instance creation with full plugin support.
 */

import { createAuthClient as createBetterAuthClientCore } from 'better-auth/client';
import {
	apiKeyClient,
	twoFactorClient,
	adminClient,
	organizationClient,
	usernameClient,
	magicLinkClient,
	siweClient,
	genericOAuthClient,
	oneTapClient,
	anonymousClient,
	phoneNumberClient,
	emailOTPClient,
	lastLoginMethodClient,
	oneTimeTokenClient,
	multiSessionClient,
} from 'better-auth/client/plugins';
import type { BetterAuthConfig, AvailablePlugins } from './config.ts';

// ============================================================================
// CLIENT PLUGIN FACTORY FUNCTIONS
// ============================================================================

/**
 * Maps plugin names to their client factory functions.
 * Note: Most client plugins don't accept configuration parameters.
 */
const CLIENT_PLUGIN_FACTORIES: Record<
	AvailablePlugins,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(config?: unknown) => any
> = {
	// Core authentication plugins
	username: () => usernameClient(),
	magicLink: () => magicLinkClient(),
	twoFactor: (config) => twoFactorClient(config as Parameters<typeof twoFactorClient>[0]),
	admin: (config) => adminClient(config as Parameters<typeof adminClient>[0]),
	organization: (config) => organizationClient(config as Parameters<typeof organizationClient>[0]),
	passkey: () => {
		throw new Error('Passkey client plugin requires @better-auth/passkey package or correct import path');
	},

	// OAuth/Auth plugins
	oidc: () => {
		throw new Error('OIDC client plugin requires correct import or @better-auth/oidc package');
	},
	siwe: () => siweClient(),
	genericOAuth: () => genericOAuthClient(),
	oneTap: (config) => oneTapClient(config as Parameters<typeof oneTapClient>[0]),

	// Integration plugins (require separate packages)
	stripe: () => {
		throw new Error('Stripe client plugin requires @better-auth/stripe package');
	},
	polar: () => {
		throw new Error('Polar client plugin requires @polar-sh/better-auth package');
	},
	dodopayments: () => {
		throw new Error('Dodo Payments client plugin requires @dodopayments/better-auth package');
	},
	dubAnalytics: () => {
		throw new Error('Dub Analytics client plugin requires @dub/better-auth package');
	},

	// Security plugins
	bearer: () => {
		// Bearer plugin is typically server-only, no client plugin needed
		return null;
	},
	jwt: () => {
		// JWT client is available but typically included automatically
		return null;
	},
	apiKey: () => apiKeyClient(),
	haveIBeenPwned: () => {
		throw new Error('Have I Been Pwned client plugin requires @better-auth/hibp package');
	},

	// Advanced plugins
	multiSession: () => multiSessionClient(),
	anonymous: () => anonymousClient(),
	phoneNumber: () => phoneNumberClient(),
	emailOTP: () => emailOTPClient(),
	deviceAuthorization: () => {
		// Device authorization is typically server-only
		return null;
	},
	lastLoginMethod: () => lastLoginMethodClient(),
	oneTimeToken: () => oneTimeTokenClient(),
};

// ============================================================================
// CLIENT INSTANCE CREATION
// ============================================================================

/**
 * Creates a fully configured better-auth client instance from a BetterAuthConfig.
 *
 * This factory function:
 * - Takes a type-safe configuration object
 * - Initializes all enabled client plugins with their configurations
 * - Sets up base URL, redirect URIs, scopes, and fetch options
 * - Returns a ready-to-use better-auth client instance
 *
 * @template ServerPlugins - Array of plugin names enabled on the server
 * @template ClientPlugins - Array of plugin names enabled on the client
 *
 * @param config - Complete better-auth configuration
 * @returns Configured better-auth client instance
 *
 * @example
 * ```typescript
 * import { createAuthClient } from '@/lib/better-auth-utilities';
 * import { authConfig } from '@/config/auth.config';
 *
 * export const authClient = createAuthClient(authConfig);
 *
 * // Type-safe API usage
 * await authClient.signIn.email({ email, password });
 * await authClient.signOut();
 * const { data: session } = authClient.useSession();
 *
 * // Plugin methods are available based on config
 * await authClient.twoFactor.enable({ password });
 * await authClient.organization.create({ name, slug });
 * ```
 */
export function createAuthClient<ServerPlugins extends readonly AvailablePlugins[] = [], ClientPlugins extends readonly AvailablePlugins[] = ServerPlugins>(
	config: BetterAuthConfig<ServerPlugins, ClientPlugins>
): ReturnType<typeof createBetterAuthClientCore> {
	// Collect enabled client plugins
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const plugins: any[] = [];

	// Add enabled client plugins
	const enabledPlugins = config.enabledClientPlugins || config.enabledServerPlugins || ([] as readonly AvailablePlugins[]);

	for (const pluginName of enabledPlugins) {
		const factory = CLIENT_PLUGIN_FACTORIES[pluginName];
		if (!factory) {
			console.warn(`Unknown client plugin: ${pluginName}`);
			continue;
		}

		try {
			// Get plugin configuration from client.plugins
			const pluginConfig = config.client.plugins?.[pluginName];
			const plugin = factory(pluginConfig);

			// Only add non-null plugins (some server-only plugins return null)
			if (plugin !== null) {
				plugins.push(plugin);
			}
		} catch (error) {
			console.error(`Failed to initialize client plugin ${pluginName}:`, error);
			// Don't throw - allow partial plugin initialization
		}
	}

	return createBetterAuthClientCore({
		baseURL: config.client.baseURL || config.server.baseURL || process.env.BETTER_AUTH_URL || 'http://localhost:3000',

		// Fetch options
		fetchOptions: {
			onSuccess: config.client.fetchOptions?.onSuccess,
			onError: config.client.fetchOptions?.onError,
			credentials: config.client.fetchOptions?.credentials || 'include',
		},

		// Add all plugins - cast to any to avoid type mismatch between plugin versions
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		plugins: plugins as any,
	});
}

/**
 * Type helper to infer the full client type including all plugins.
 *
 * @example
 * ```typescript
 * const authClient = createAuthClient(authConfig);
 * export type AuthClient = InferAuthClient<typeof authClient>;
 * ```
 */
export type InferAuthClient<T extends ReturnType<typeof createBetterAuthClientCore>> = T;

export const createBetterAuthClient = createAuthClient;

type AuthClientReservedKey = '$fetch' | '$store' | '$Infer' | '$ERROR_CODES' | 'useSession';

type AuthClientApiEndpointKeyAccumulator<TValue, TPrefix extends string = never> = TValue extends (...args: unknown[]) => unknown
	? TPrefix
	: TValue extends Record<string, unknown>
		? {
				[TKey in keyof TValue & string]: AuthClientApiEndpointKeyAccumulator<TValue[TKey], TPrefix extends never ? TKey : `${TPrefix}.${TKey}`>;
			}[keyof TValue & string]
		: never;

type AuthClientApiAtPath<TValue, TPath extends string> = TPath extends `${infer THead}.${infer TTail}`
	? THead extends keyof TValue & string
		? AuthClientApiAtPath<TValue[THead], TTail>
		: never
	: TPath extends keyof TValue & string
		? TValue[TPath]
		: never;

/**
 * Resolves the canonical Better Auth client instance returned by {@link createAuthClient}.
 *
 * @remarks Consumers typically import this alias and pair it with {@link createAuthClient}
 * to share a single source of truth, mirroring the server-side {@link AuthServer} helper. A
 * compatibility alias {@link createBetterAuthClient} is also exported for existing imports.
 */
export type AuthClient = ReturnType<typeof createBetterAuthClientCore>;

/**
 * Narrows the inferred Better Auth client created by {@link createAuthClient}.
 *
 * @typeParam TAuthClient - The concrete client instance produced by `createAuthClient`.
 *
 * @example
 * ```typescript
 * import { createAuthClient } from '@emperorrag/better-auth-utilities/client';
 * import type { AuthClientOf } from '@emperorrag/better-auth-utilities/client';
 *
 * export const authClient = createAuthClient(config);
 * export type AuthClient = AuthClientOf<typeof authClient>;
 * ```
 */
export type AuthClientOf<TAuthClient extends AuthClient> = TAuthClient;

/**
 * Extracts the strongly typed Better Auth API surface from a client instance.
 *
 * @typeParam TAuthClient - The Better Auth client whose API contract should be exposed.
 *
 * @example
 * ```typescript
 * import type { AuthClientApiOf } from '@emperorrag/better-auth-utilities/client';
 *
 * type AuthClientApi = AuthClientApiOf<AuthClient>;
 * ```
 */
export type AuthClientApiOf<TAuthClient extends AuthClient> = Omit<TAuthClient, AuthClientReservedKey>;

/**
 * Enumerates valid endpoint keys for a Better Auth client API as `dot` separated paths.
 *
 * @typeParam TAuthClient - The Better Auth client whose endpoint keys are required.
 *
 * @example
 * ```typescript
 * import type { AuthClientApiEndpointKeyOf } from '@emperorrag/better-auth-utilities/client';
 *
 * type EndpointKey = AuthClientApiEndpointKeyOf<AuthClient>;
 * ```
 */
export type AuthClientApiEndpointKeyOf<TAuthClient extends AuthClient> = AuthClientApiEndpointKeyAccumulator<AuthClientApiOf<TAuthClient>>;

/**
 * Resolves the endpoint signature for a specific Better Auth client API key.
 *
 * @typeParam TAuthClient - The Better Auth client instance providing the API.
 * @typeParam TEndpointKey - The endpoint key whose call signature should be inferred.
 *
 * @example
 * ```typescript
 * import type { AuthClientApiEndpointOf } from '@emperorrag/better-auth-utilities/client';
 *
 * type AnyClientEndpoint = AuthClientApiEndpointOf<AuthClient, 'signIn.email'>;
 * ```
 */
export type AuthClientApiEndpointOf<TAuthClient extends AuthClient, TEndpointKey extends AuthClientApiEndpointKeyOf<TAuthClient>> = AuthClientApiAtPath<
	AuthClientApiOf<TAuthClient>,
	TEndpointKey
>;

/**
 * Retrieves the full parameter tuple for a concrete Better Auth client API endpoint.
 *
 * @typeParam TAuthClient - The Better Auth client instance supplying the API.
 * @typeParam TEndpointKey - The endpoint key whose parameter tuple should be inferred.
 *
 * @example
 * ```typescript
 * import type { AuthClientApiEndpointParametersOf } from '@emperorrag/better-auth-utilities/client';
 *
 * type SignInParams = AuthClientApiEndpointParametersOf<AuthClient, 'signIn.email'>;
 * ```
 */
export type AuthClientApiEndpointParametersOf<TAuthClient extends AuthClient, TEndpointKey extends AuthClientApiEndpointKeyOf<TAuthClient>> =
	AuthClientApiEndpointOf<TAuthClient, TEndpointKey> extends (...args: infer TParameters) => unknown ? TParameters : never;

/**
 * Picks the first argument accepted by a Better Auth client API endpoint.
 *
 * @typeParam TAuthClient - The Better Auth client instance supplying the API.
 * @typeParam TEndpointKey - The endpoint key whose first argument should be inferred.
 *
 * @example
 * ```typescript
 * import type { AuthClientApiEndpointFirstParameter } from '@emperorrag/better-auth-utilities/client';
 *
 * type SignInArgs = AuthClientApiEndpointFirstParameter<AuthClient, 'signIn.email'>;
 * ```
 */
export type AuthClientApiEndpointFirstParameter<TAuthClient extends AuthClient, TEndpointKey extends AuthClientApiEndpointKeyOf<TAuthClient>> =
	AuthClientApiEndpointParametersOf<TAuthClient, TEndpointKey> extends [infer TFirst, ...unknown[]] ? TFirst : never;

/**
 * Extracts the request body contract for a Better Auth client API endpoint.
 *
 * @typeParam TAuthClient - The Better Auth client supplying the API contract.
 * @typeParam TEndpointKey - The endpoint key whose request body should be inferred.
 *
 * @example
 * ```typescript
 * import type { AuthClientApiEndpointBody } from '@emperorrag/better-auth-utilities/client';
 *
 * type SignUpBody = AuthClientApiEndpointBody<AuthClient, 'signUp.email'>;
 * ```
 */
export type AuthClientApiEndpointBody<TAuthClient extends AuthClient, TEndpointKey extends AuthClientApiEndpointKeyOf<TAuthClient>> =
	AuthClientApiEndpointFirstParameter<TAuthClient, TEndpointKey> extends { body: infer TBody } ? TBody : never;

/**
 * Infers the Better Auth session payload, including plugin augmentations, from a client instance.
 *
 * @typeParam TAuthCli - The Better Auth client from which to derive the session structure.
 *
 * @example
 * ```typescript
 * import type { AuthClientSessionOf } from '@emperorrag/better-auth-utilities/client';
 *
 * type AuthClientSession = AuthClientSessionOf<AuthClient>;
 * ```
 */
export type AuthClientSessionOf<TAuthCli extends AuthClient> = TAuthCli extends { $Infer: { Session: infer TSession } } ? TSession : never;

/**
 * Extracts the raw session record embedded inside {@link AuthClientSessionOf}.
 *
 * @typeParam TAuthCli - The Better Auth client whose session record should be exposed.
 *
 * @example
 * ```typescript
 * import type { AuthClientSessionUserSessionOf } from '@emperorrag/better-auth-utilities/client';
 *
 * type SessionRecord = AuthClientSessionUserSessionOf<AuthClient>;
 * ```
 */
export type AuthClientSessionUserSessionOf<TAuthCli extends AuthClient> =
	AuthClientSessionOf<TAuthCli> extends {
		session: infer TSessionRecord;
	}
		? TSessionRecord
		: never;

/**
 * Extracts the user profile representation embedded in the Better Auth client session.
 *
 * @typeParam TAuthCli - The Better Auth client whose user payload should be exposed.
 *
 * @example
 * ```typescript
 * import type { AuthClientSessionUserOf } from '@emperorrag/better-auth-utilities/client';
 *
 * type SessionUser = AuthClientSessionUserOf<AuthClient>;
 * ```
 */
export type AuthClientSessionUserOf<TAuthCli extends AuthClient> =
	AuthClientSessionOf<TAuthCli> extends {
		user: infer TUser;
	}
		? TUser
		: never;
