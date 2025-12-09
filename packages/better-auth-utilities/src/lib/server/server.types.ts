// =============================================================================
// Subpath Import (Optimized for TS Server Performance)
// Using 'better-auth/types' instead of root 'better-auth' to avoid loading
// runtime code when only types are needed.
// =============================================================================
import type { betterAuth } from 'better-auth';
import type { AuthServerDatabaseOptions } from '../shared/config/config.types';

export type { AuthServerDatabaseOptions };

/**
 * Cached type alias for the Better Auth server instance return type.
 *
 * @pure
 * @description Pre-computed type representing `ReturnType<typeof betterAuth>`. This cached alias improves
 * TypeScript language server responsiveness by avoiding repeated evaluation of the complex generic type.
 * Import this type in other modules instead of importing `betterAuth` directly when only type information
 * is needed, reducing module resolution overhead and type computation costs.
 *
 * @example
 * ```typescript
 * // In a separate types file - no need to import 'better-auth'
 * import type { AuthServer } from '@emperorrag/better-auth-utilities';
 *
 * type MyServerApi = AuthServer['api'];
 * type MySession = AuthServer['$Infer']['Session'];
 * ```
 */
export type AuthServer = ReturnType<typeof betterAuth>;

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
export type AuthServerFor<T extends AuthServer = AuthServer> = T;

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
export type AuthServerApiKeyFor<T extends AuthServerFor = AuthServerFor> = Exclude<keyof AuthServerFor<T>, AuthServerReservedKey>;

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
export type AuthServerApiFor<T extends AuthServerFor = AuthServerFor> = T['api'];

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
export type AuthServerApiEndpointKeyFor<T extends AuthServerFor = AuthServerFor> = keyof AuthServerApiFor<T>;

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
export type AuthServerApiEndpointFor<T extends AuthServerFor = AuthServerFor> = AuthServerApiFor<T>[AuthServerApiEndpointKeyFor<T>];

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
export type AuthServerSessionFor<T extends AuthServerFor = AuthServerFor> = T['$Infer']['Session'];

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
export type AuthServerSessionUserFor<T extends AuthServerFor = AuthServerFor> = T['$Infer']['Session']['user'];

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
export type AuthServerSessionUserSessionFor<T extends AuthServerFor = AuthServerFor> = T['$Infer']['Session']['session'];

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
export type AuthServerSignInFor<T extends AuthServerFor = AuthServerFor> =
	'signInEmail' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['signInEmail'] : never;

/**
 * Type helper to extract the signOut endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `signOut` method from the server API. This method terminates
 * the current user session, invalidating the session in the database and clearing authentication cookies.
 *
 * @example
 * ```typescript
 * type SignOutMethod = AuthServerSignOutFor<typeof authServer>;
 * // (args: { headers: Headers, ... }) => Promise<{ success: boolean }>
 *
 * // Usage in implementation
 * const signOut: SignOutMethod = authServer.api.signOut;
 * await signOut({ headers: request.headers });
 * ```
 */
export type AuthServerSignOutFor<T extends AuthServerFor = AuthServerFor> =
	'signOut' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['signOut'] : never;

/**
 * Type helper to extract the getSession endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `getSession` method from the server API. This method retrieves
 * the current user session from the provided headers, returning user and session data if authenticated.
 *
 * @example
 * ```typescript
 * type GetSessionMethod = AuthServerGetSessionFor<typeof authServer>;
 * // (args: { headers: Headers, ... }) => Promise<Session | null>
 *
 * // Usage in implementation
 * const getSession: GetSessionMethod = authServer.api.getSession;
 * const session = await getSession({ headers: request.headers });
 * ```
 */
export type AuthServerGetSessionFor<T extends AuthServerFor = AuthServerFor> =
	'getSession' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['getSession'] : never;

/**
 * Type helper to extract the updateUser endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `updateUser` method from the server API. This method updates
 * user profile information such as name, image, or other custom fields.
 *
 * @example
 * ```typescript
 * type UpdateUserMethod = AuthServerUpdateUserFor<typeof authServer>;
 * // (args: { body: { name?: string, image?: string, ... }, headers: Headers, ... }) => Promise<User>
 *
 * // Usage in implementation
 * const updateUser: UpdateUserMethod = authServer.api.updateUser;
 * const updatedUser = await updateUser({
 *   body: { name: 'New Name' },
 *   headers: request.headers
 * });
 * ```
 */
export type AuthServerUpdateUserFor<T extends AuthServerFor = AuthServerFor> =
	'updateUser' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['updateUser'] : never;

/**
 * Type helper to extract the sendVerificationEmail endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `sendVerificationEmail` method from the server API. This method
 * triggers sending a verification email to the specified email address with a secure verification link.
 *
 * @example
 * ```typescript
 * type SendVerificationEmailMethod = AuthServerSendVerificationEmailFor<typeof authServer>;
 * // (args: { body: { email: string, callbackURL?: string }, ... }) => Promise<{ status: boolean }>
 *
 * // Usage in implementation
 * const sendVerificationEmail: SendVerificationEmailMethod = authServer.api.sendVerificationEmail;
 * await sendVerificationEmail({
 *   body: { email: 'user@example.com', callbackURL: '/verify' }
 * });
 * ```
 */
export type AuthServerSendVerificationEmailFor<T extends AuthServerFor = AuthServerFor> =
	'sendVerificationEmail' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['sendVerificationEmail'] : never;

/**
 * Type helper to extract the changePassword endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `changePassword` method from the server API. This method allows
 * authenticated users to change their password by providing current and new passwords.
 *
 * @example
 * ```typescript
 * type ChangePasswordMethod = AuthServerChangePasswordFor<typeof authServer>;
 * // (args: { body: { currentPassword: string, newPassword: string, revokeOtherSessions?: boolean }, headers: Headers, ... }) => Promise<User>
 *
 * // Usage in implementation
 * const changePassword: ChangePasswordMethod = authServer.api.changePassword;
 * await changePassword({
 *   body: { currentPassword: 'oldSecret', newPassword: 'newSecret' },
 *   headers: request.headers
 * });
 * ```
 */
export type AuthServerChangePasswordFor<T extends AuthServerFor = AuthServerFor> =
	'changePassword' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['changePassword'] : never;

/**
 * Type helper to extract the forgetPassword endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `forgetPassword` method from the server API. This method initiates
 * the password reset workflow by sending a secure reset link to the user's email address.
 *
 * @example
 * ```typescript
 * type ForgetPasswordMethod = AuthServerForgetPasswordFor<typeof authServer>;
 * // (args: { body: { email: string, redirectTo?: string }, ... }) => Promise<{ status: boolean }>
 *
 * // Usage in implementation
 * const forgetPassword: ForgetPasswordMethod = authServer.api.forgetPassword;
 * await forgetPassword({
 *   body: { email: 'user@example.com', redirectTo: '/reset-password' }
 * });
 * ```
 */
export type AuthServerForgetPasswordFor<T extends AuthServerFor = AuthServerFor> =
	'forgetPassword' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['forgetPassword'] : never;

/**
 * Type helper to extract the resetPassword endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `resetPassword` method from the server API. This method completes
 * the password reset workflow by validating the reset token and setting a new password.
 *
 * @example
 * ```typescript
 * type ResetPasswordMethod = AuthServerResetPasswordFor<typeof authServer>;
 * // (args: { body: { token: string, newPassword: string }, headers?: Headers, ... }) => Promise<{ status: boolean, user?: User }>
 *
 * // Usage in implementation
 * const resetPassword: ResetPasswordMethod = authServer.api.resetPassword;
 * await resetPassword({
 *   body: { token: 'reset-token', newPassword: 'newSecurePassword' },
 *   headers: request.headers
 * });
 * ```
 */
export type AuthServerResetPasswordFor<T extends AuthServerFor = AuthServerFor> =
	'resetPassword' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['resetPassword'] : never;

/**
 * Type helper to extract the signInSocial endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `signInSocial` method from the server API. This method initiates
 * OAuth sign-in flow with a social provider, returning a redirect URL for the authorization flow.
 *
 * @example
 * ```typescript
 * type SignInSocialMethod = AuthServerSignInSocialFor<typeof authServer>;
 * // (args: { body: { provider: string, callbackURL?: string, ... }, ... }) => Promise<{ url: string, redirect: boolean }>
 *
 * // Usage in implementation
 * const signInSocial: SignInSocialMethod = authServer.api.signInSocial;
 * const { url } = await signInSocial({
 *   body: { provider: 'google', callbackURL: '/dashboard' }
 * });
 * ```
 */
export type AuthServerSignInSocialFor<T extends AuthServerFor = AuthServerFor> =
	'signInSocial' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['signInSocial'] : never;

/**
 * Type helper to extract the listUserAccounts endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `listUserAccounts` method from the server API. This method retrieves
 * all linked accounts (OAuth providers, credentials) for the authenticated user.
 *
 * @example
 * ```typescript
 * type ListUserAccountsMethod = AuthServerListUserAccountsFor<typeof authServer>;
 * // (args: { headers: Headers, ... }) => Promise<Account[]>
 *
 * // Usage in implementation
 * const listUserAccounts: ListUserAccountsMethod = authServer.api.listUserAccounts;
 * const accounts = await listUserAccounts({ headers: request.headers });
 * ```
 */
export type AuthServerListUserAccountsFor<T extends AuthServerFor = AuthServerFor> =
	'listUserAccounts' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['listUserAccounts'] : never;

/**
 * Type helper to extract the unlinkAccount endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `unlinkAccount` method from the server API. This method removes
 * a linked OAuth provider account from the authenticated user.
 *
 * @example
 * ```typescript
 * type UnlinkAccountMethod = AuthServerUnlinkAccountFor<typeof authServer>;
 * // (args: { body: { providerId: string }, headers: Headers, ... }) => Promise<{ status: boolean }>
 *
 * // Usage in implementation
 * const unlinkAccount: UnlinkAccountMethod = authServer.api.unlinkAccount;
 * await unlinkAccount({
 *   body: { providerId: 'google' },
 *   headers: request.headers
 * });
 * ```
 */
export type AuthServerUnlinkAccountFor<T extends AuthServerFor = AuthServerFor> =
	'unlinkAccount' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['unlinkAccount'] : never;

/**
 * Type helper to extract the callbackOAuth endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `callbackOAuth` method from the server API. This method handles
 * the OAuth callback after provider authentication.
 *
 * @example
 * ```typescript
 * type CallbackOAuthMethod = AuthServerCallbackOAuthFor<typeof authServer>;
 * ```
 */
export type AuthServerCallbackOAuthFor<T extends AuthServerFor = AuthServerFor> =
	'callbackOAuth' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['callbackOAuth'] : never;

/**
 * Type helper to extract the verifyEmail endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `verifyEmail` method from the server API. This method verifies
 * a user's email address using the verification token.
 *
 * @example
 * ```typescript
 * type VerifyEmailMethod = AuthServerVerifyEmailFor<typeof authServer>;
 * ```
 */
export type AuthServerVerifyEmailFor<T extends AuthServerFor = AuthServerFor> =
	'verifyEmail' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['verifyEmail'] : never;

/**
 * Type helper to extract the changeEmail endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `changeEmail` method from the server API. This method allows
 * users to change their email address.
 *
 * @example
 * ```typescript
 * type ChangeEmailMethod = AuthServerChangeEmailFor<typeof authServer>;
 * ```
 */
export type AuthServerChangeEmailFor<T extends AuthServerFor = AuthServerFor> =
	'changeEmail' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['changeEmail'] : never;

/**
 * Type helper to extract the setPassword endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `setPassword` method from the server API. This method allows
 * users to set a password (typically for OAuth-only accounts).
 *
 * @example
 * ```typescript
 * type SetPasswordMethod = AuthServerSetPasswordFor<typeof authServer>;
 * ```
 */
export type AuthServerSetPasswordFor<T extends AuthServerFor = AuthServerFor> =
	'setPassword' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['setPassword'] : never;

/**
 * Type helper to extract the deleteUser endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `deleteUser` method from the server API. This method allows
 * users to delete their account.
 *
 * @example
 * ```typescript
 * type DeleteUserMethod = AuthServerDeleteUserFor<typeof authServer>;
 * ```
 */
export type AuthServerDeleteUserFor<T extends AuthServerFor = AuthServerFor> =
	'deleteUser' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['deleteUser'] : never;

/**
 * Type helper to extract the deleteUserCallback endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `deleteUserCallback` method from the server API. This method handles
 * the callback after user deletion confirmation.
 *
 * @example
 * ```typescript
 * type DeleteUserCallbackMethod = AuthServerDeleteUserCallbackFor<typeof authServer>;
 * ```
 */
export type AuthServerDeleteUserCallbackFor<T extends AuthServerFor = AuthServerFor> =
	'deleteUserCallback' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['deleteUserCallback'] : never;

/**
 * Type helper to extract the forgetPasswordCallback endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `forgetPasswordCallback` method from the server API. This method handles
 * the callback from the forget password email link.
 *
 * @example
 * ```typescript
 * type ForgetPasswordCallbackMethod = AuthServerForgetPasswordCallbackFor<typeof authServer>;
 * ```
 */
export type AuthServerForgetPasswordCallbackFor<T extends AuthServerFor = AuthServerFor> =
	'forgetPasswordCallback' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['forgetPasswordCallback'] : never;

/**
 * Type helper to extract the requestPasswordReset endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `requestPasswordReset` method from the server API. This method initiates
 * the password reset workflow.
 *
 * @example
 * ```typescript
 * type RequestPasswordResetMethod = AuthServerRequestPasswordResetFor<typeof authServer>;
 * ```
 */
export type AuthServerRequestPasswordResetFor<T extends AuthServerFor = AuthServerFor> =
	'requestPasswordReset' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['requestPasswordReset'] : never;

/**
 * Type helper to extract the requestPasswordResetCallback endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `requestPasswordResetCallback` method from the server API. This method handles
 * the callback from the password reset email link.
 *
 * @example
 * ```typescript
 * type RequestPasswordResetCallbackMethod = AuthServerRequestPasswordResetCallbackFor<typeof authServer>;
 * ```
 */
export type AuthServerRequestPasswordResetCallbackFor<T extends AuthServerFor = AuthServerFor> =
	'requestPasswordResetCallback' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['requestPasswordResetCallback'] : never;

/**
 * Type helper to extract the listSessions endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `listSessions` method from the server API. This method retrieves
 * all active sessions for the authenticated user.
 *
 * @example
 * ```typescript
 * type ListSessionsMethod = AuthServerListSessionsFor<typeof authServer>;
 * ```
 */
export type AuthServerListSessionsFor<T extends AuthServerFor = AuthServerFor> =
	'listSessions' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['listSessions'] : never;

/**
 * Type helper to extract the revokeSession endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `revokeSession` method from the server API. This method revokes
 * a specific session by ID.
 *
 * @example
 * ```typescript
 * type RevokeSessionMethod = AuthServerRevokeSessionFor<typeof authServer>;
 * ```
 */
export type AuthServerRevokeSessionFor<T extends AuthServerFor = AuthServerFor> =
	'revokeSession' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['revokeSession'] : never;

/**
 * Type helper to extract the revokeSessions endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `revokeSessions` method from the server API. This method revokes
 * all sessions for the authenticated user.
 *
 * @example
 * ```typescript
 * type RevokeSessionsMethod = AuthServerRevokeSessionsFor<typeof authServer>;
 * ```
 */
export type AuthServerRevokeSessionsFor<T extends AuthServerFor = AuthServerFor> =
	'revokeSessions' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['revokeSessions'] : never;

/**
 * Type helper to extract the revokeOtherSessions endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `revokeOtherSessions` method from the server API. This method revokes
 * all sessions except the current one.
 *
 * @example
 * ```typescript
 * type RevokeOtherSessionsMethod = AuthServerRevokeOtherSessionsFor<typeof authServer>;
 * ```
 */
export type AuthServerRevokeOtherSessionsFor<T extends AuthServerFor = AuthServerFor> =
	'revokeOtherSessions' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['revokeOtherSessions'] : never;

/**
 * Type helper to extract the linkSocialAccount endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `linkSocialAccount` method from the server API. This method links
 * a social OAuth provider to an existing user account.
 *
 * @example
 * ```typescript
 * type LinkSocialAccountMethod = AuthServerLinkSocialAccountFor<typeof authServer>;
 * ```
 */
export type AuthServerLinkSocialAccountFor<T extends AuthServerFor = AuthServerFor> =
	'linkSocialAccount' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['linkSocialAccount'] : never;

/**
 * Type helper to extract the refreshToken endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `refreshToken` method from the server API. This method refreshes
 * an expired access token using a refresh token.
 *
 * @example
 * ```typescript
 * type RefreshTokenMethod = AuthServerRefreshTokenFor<typeof authServer>;
 * ```
 */
export type AuthServerRefreshTokenFor<T extends AuthServerFor = AuthServerFor> =
	'refreshToken' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['refreshToken'] : never;

/**
 * Type helper to extract the getAccessToken endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `getAccessToken` method from the server API. This method retrieves
 * the current access token for the session.
 *
 * @example
 * ```typescript
 * type GetAccessTokenMethod = AuthServerGetAccessTokenFor<typeof authServer>;
 * ```
 */
export type AuthServerGetAccessTokenFor<T extends AuthServerFor = AuthServerFor> =
	'getAccessToken' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['getAccessToken'] : never;

/**
 * Type helper to extract the accountInfo endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `accountInfo` method from the server API. This method retrieves
 * account information for the authenticated user.
 *
 * @example
 * ```typescript
 * type AccountInfoMethod = AuthServerAccountInfoFor<typeof authServer>;
 * ```
 */
export type AuthServerAccountInfoFor<T extends AuthServerFor = AuthServerFor> =
	'accountInfo' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['accountInfo'] : never;

/**
 * Type helper to extract the ok endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `ok` utility method from the server API.
 *
 * @example
 * ```typescript
 * type OkMethod = AuthServerOkFor<typeof authServer>;
 * ```
 */
export type AuthServerOkFor<T extends AuthServerFor = AuthServerFor> = 'ok' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['ok'] : never;

/**
 * Type helper to extract the error endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `error` utility method from the server API.
 *
 * @example
 * ```typescript
 * type ErrorMethod = AuthServerErrorFor<typeof authServer>;
 * ```
 */
export type AuthServerErrorFor<T extends AuthServerFor = AuthServerFor> = 'error' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['error'] : never;
