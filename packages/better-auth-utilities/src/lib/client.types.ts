import { createAuthClient } from 'better-auth/client';

type AuthClientReservedKey = '$fetch' | '$store' | '$ERROR_CODES' | '$Infer';

/**
 * Type helper to infer the full client type including all plugins.
 *
 * @example
 * ```typescript
 * const authClient = createAuthClient(authConfig);
 * export type AuthClient = AuthClientFor<typeof authClient>;
 * ```
 */
export type AuthClientFor<T extends ReturnType<typeof createAuthClient> = ReturnType<typeof createAuthClient>> = T;

/**
 * Type helper to extract API method keys from an AuthClient type, excluding reserved internal properties.
 *
 * @description Filters out Better Auth internal keys ($fetch, $store, $ERROR_CODES, $Infer) to return only callable API methods.
 *
 * @example
 * ```typescript
 * type MyClientKeys = AuthClientApiKeyFor<typeof authClient>;
 * // 'signIn' | 'signOut' | 'session' | 'signUp' | ... (no $ prefixed keys)
 * ```
 */
export type AuthClientApiKeyFor<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> = Exclude<
	keyof AuthClientFor<T>,
	AuthClientReservedKey
>;

/**
 * Type helper to extract only the API methods from an AuthClient type, excluding reserved internal properties.
 *
 * @description Returns a Pick type containing only the public API methods, filtering out Better Auth internals.
 *
 * @example
 * ```typescript
 * type MyClientApi = AuthClientApiFor<typeof authClient>;
 * // { signIn: ..., signOut: ..., session: ..., signUp: ... } (no $ prefixed properties)
 * ```
 */
export type AuthClientApiFor<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> = Pick<
	AuthClientFor<T>,
	AuthClientApiKeyFor<T>
>;

/**
 * Type helper to extract the union of all API endpoint types from an AuthClient.
 *
 * @description Returns a union of all property types in the API surface (signIn type | signOut type | session type | ...).
 *
 * @example
 * ```typescript
 * type AllEndpoints = AuthClientApiEndpointFor<typeof authClient>;
 * // Will be a union of all method/property types
 * ```
 */
export type AuthClientApiEndpointFor<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> =
	AuthClientApiFor<T>[keyof AuthClientApiFor<T>];

/**
 * Type helper to extract the union of all keys from API endpoint types.
 *
 * @description Returns a union of all property keys across all API endpoints.
 *
 * @example
 * ```typescript
 * type AllEndpointKeys = AuthClientApiEndpointKeyFor<typeof authClient>;
 * // Union of all keys from all endpoint objects
 * ```
 */
export type AuthClientApiEndpointKeyFor<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> =
	keyof AuthClientApiEndpointFor<T>;

/**
 * Type helper to extract the signIn method type from an AuthClient.
 *
 * @description Returns the type of the signIn method, including any plugin-specific overloads.
 *
 * @example
 * ```typescript
 * type SignInMethod = AuthClientSignInFor<typeof authClient>;
 * // (credentials: {...}) => Promise<...>
 * ```
 */
export type AuthClientSignInFor<T extends AuthClientFor<ReturnType<typeof createAuthClient>> = AuthClientFor<ReturnType<typeof createAuthClient>>> =
	'signIn' extends AuthClientApiKeyFor<T> ? AuthClientApiFor<T>['signIn'] : never;
