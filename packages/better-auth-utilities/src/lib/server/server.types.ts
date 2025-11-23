import type { betterAuth, BetterAuthOptions } from 'better-auth';

/**
 * Type helper to extract the database configuration type from Better Auth options.
 *
 * @pure
 * @description Returns the type of the `database` property from BetterAuthOptions.
 * This allows the configuration to accept any valid Better Auth database adapter or configuration,
 * including native Node.js SQLite instances.
 */
export type AuthServerDatabaseOptions = BetterAuthOptions['database'];

/**
 * Reserved keys on the Better Auth server instance that should not be included in the API surface type extraction.
 *
 * @description These keys provide internal functionality or type inference and are not part of the public API surface:
 * - `$Infer`: Type inference container for Session, User, and other plugin-extended types
 * - `handler`: HTTP handler function for framework integration (optional internal property)
 * - `options`: BetterAuthOptions configuration object (optional internal property)
 */
type AuthServerReservedKey = '$Infer' | 'handler' | 'options';

/**
 * Type helper to infer the full server type including all plugins.
 *
 * @pure
 * @description Extracts the complete Better Auth server instance type from a `betterAuth()` call,
 * preserving all plugin augmentations and type inference capabilities. Use this as the foundation
 * for extracting specific API surfaces or session types.
 *
 * @example
 * ```typescript
 * const authServer = betterAuth({
 *   database: prismaAdapter(prisma),
 *   plugins: [username(), admin()]
 * });
 *
 * export type AuthServer = AuthServerFor<typeof authServer>;
 * // AuthServer includes api property with all core + plugin methods
 * ```
 */
export type AuthServerFor<T extends ReturnType<typeof betterAuth> = ReturnType<typeof betterAuth>> = T;

/**
 * Type helper to extract API method keys from an AuthServer type, excluding reserved internal properties.
 *
 * @pure
 * @description Filters out Better Auth internal keys (`$Infer`, `handler`, `options`) to return only
 * the `'api'` property key. This is primarily used internally by other type helpers but can be useful
 * for validating server instance structure.
 *
 * @example
 * ```typescript
 * type ServerKeys = AuthServerApiKeyFor<typeof authServer>;
 * // 'api'
 * ```
 */
export type AuthServerApiKeyFor<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = Exclude<
	keyof AuthServerFor<T>,
	AuthServerReservedKey
>;

/**
 * Type helper to extract the API surface from an AuthServer type.
 *
 * @pure
 * @description Returns the type of the `api` property containing all endpoint methods from Better Auth core
 * and installed plugins. Each method accepts structured arguments with `body`, `headers`, `query`, `asResponse`,
 * and `returnHeaders` properties.
 *
 * @example
 * ```typescript
 * type ServerApi = AuthServerApiFor<typeof authServer>;
 * // { signInEmail: (...) => Promise<...>, signUpEmail: (...) => Promise<...>, getSession: (...) => Promise<...>, ... }
 *
 * // Usage in implementation
 * const api: ServerApi = authServer.api;
 * await api.signInEmail({ body: { email: '...', password: '...' }, headers: new Headers() });
 * ```
 */
export type AuthServerApiFor<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = T['api'];

/**
 * Type helper to extract endpoint method keys from the server API.
 *
 * @pure
 * @description Returns a union of all available endpoint method names on `auth.api`, including both
 * core endpoints (signInEmail, signUpEmail, getSession, etc.) and plugin-added endpoints (listUsers,
 * createApiKey, etc.). Use this to enumerate or validate endpoint names.
 *
 * @example
 * ```typescript
 * type EndpointKeys = AuthServerApiEndpointKeyFor<typeof authServer>;
 * // 'signInEmail' | 'signUpEmail' | 'signOut' | 'getSession' | 'listSessions' | 'updateUser' | ...
 *
 * // Can be used to validate endpoint existence
 * function callEndpoint<K extends EndpointKeys>(endpoint: K) {
 *   return authServer.api[endpoint];
 * }
 * ```
 */
export type AuthServerApiEndpointKeyFor<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> =
	keyof AuthServerApiFor<T>;

/**
 * Type helper to extract the union of all API endpoint method types.
 *
 * @pure
 * @description Returns a union of all endpoint method function types from the server API.
 * Each method type represents a callable endpoint with its specific parameter and return types.
 *
 * @example
 * ```typescript
 * type AllEndpoints = AuthServerApiEndpointFor<typeof authServer>;
 * // (args: { body?: ..., headers?: Headers, ... }) => Promise<...> | (args: ...) => Promise<...> | ...
 * ```
 */
export type AuthServerApiEndpointFor<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> =
	AuthServerApiFor<T>[AuthServerApiEndpointKeyFor<T>];

/**
 * Type helper to extract the Better Auth session type including plugin augmentations.
 *
 * @pure
 * @description Extracts the complete session type from `auth.$Infer.Session`, which contains both
 * the `user` object and the `session` record. Plugins may extend both objects with additional fields.
 * This type represents the return value from `auth.api.getSession()`.
 *
 * @example
 * ```typescript
 * type Session = AuthServerSessionFor<typeof authServer>;
 * // { user: { id: string, email: string, ... }, session: { id: string, userId: string, ... } }
 *
 * // Usage in implementation
 * const sessionResult = await authServer.api.getSession({ headers });
 * if (sessionResult) {
 *   const session: Session = sessionResult;
 *   console.log(session.user.email, session.session.id);
 * }
 * ```
 */
export type AuthServerSessionFor<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> =
	T['$Infer']['Session'];

/**
 * Type helper to extract the user object from a Better Auth session.
 *
 * @pure
 * @description Extracts just the `user` portion of the session type, which contains user profile information
 * like id, email, name, and any plugin-added fields (username, role, etc.). This is useful when you only
 * need user data without the session metadata.
 *
 * @example
 * ```typescript
 * type User = AuthServerSessionUserFor<typeof authServer>;
 * // { id: string, email: string, name: string, emailVerified: boolean, ... }
 *
 * // Usage in implementation
 * const sessionResult = await authServer.api.getSession({ headers });
 * if (sessionResult) {
 *   const user: User = sessionResult.user;
 *   console.log(user.email, user.name);
 * }
 * ```
 */
export type AuthServerSessionUserFor<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> =
	T['$Infer']['Session']['user'];

/**
 * Type helper to extract the session record from a Better Auth session.
 *
 * @pure
 * @description Extracts just the `session` portion of the session type, which contains session metadata
 * like id, userId, expiresAt, ipAddress, userAgent, and any plugin-added fields. This is useful when
 * you need session management data without user profile information.
 *
 * @example
 * ```typescript
 * type SessionRecord = AuthServerSessionUserSessionFor<typeof authServer>;
 * // { id: string, userId: string, expiresAt: Date, ipAddress: string, userAgent: string, ... }
 *
 * // Usage in implementation
 * const sessionResult = await authServer.api.getSession({ headers });
 * if (sessionResult) {
 *   const sessionRecord: SessionRecord = sessionResult.session;
 *   console.log(sessionRecord.id, sessionRecord.expiresAt);
 * }
 * ```
 */
export type AuthServerSessionUserSessionFor<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> =
	T['$Infer']['Session']['session'];

/**
 * Type helper to extract the signIn endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `signInEmail` method from the server API. This method authenticates
 * users with email and password, returning session data or throwing an APIError on failure.
 *
 * @example
 * ```typescript
 * type SignInMethod = AuthServerSignInFor<typeof authServer>;
 * // (args: { body: { email: string, password: string }, headers?: Headers, ... }) => Promise<Session>
 *
 * // Usage in implementation
 * const signIn: SignInMethod = authServer.api.signInEmail;
 * const session = await signIn({
 *   body: { email: 'user@example.com', password: 'secret' },
 *   headers: request.headers
 * });
 * ```
 */
export type AuthServerSignInFor<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> =
	'signInEmail' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['signInEmail'] : never;

/**
 * Type helper to extract the signUp endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `signUpEmail` method from the server API. This method creates
 * new user accounts with email and password, optionally including name and other fields, returning
 * session data or throwing an APIError on failure.
 *
 * @example
 * ```typescript
 * type SignUpMethod = AuthServerSignUpFor<typeof authServer>;
 * // (args: { body: { email: string, password: string, name?: string }, headers?: Headers, ... }) => Promise<Session>
 *
 * // Usage in implementation
 * const signUp: SignUpMethod = authServer.api.signUpEmail;
 * const session = await signUp({
 *   body: { email: 'newuser@example.com', password: 'secret', name: 'John Doe' },
 *   headers: request.headers
 * });
 * ```
 */
export type AuthServerSignUpFor<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> =
	'signUpEmail' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['signUpEmail'] : never;
