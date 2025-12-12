/**
 * Enum representing the available API endpoints on the Better Auth server.
 *
 * @description This enum provides string constants for all API methods exposed by the Better Auth server instance.
 * It corresponds to the keys of the `api` property on the server instance and can be used for
 * type-safe reference to endpoint names in configuration, routing, or client generation.
 *
 * @see {@link AuthServerApiEndpointKeyFor} in `server.types.ts`
 */
import * as Data from 'effect/Data';

/**
 * Enum representing the available API endpoints on the Better Auth server.
 *
 * @description This enum provides string constants for all API methods exposed by the Better Auth server instance.
 * It corresponds to the keys of the `api` property on the server instance and can be used for
 * type-safe reference to endpoint names in configuration, routing, or client generation.
 *
 * @see {@link AuthServerApiEndpointKeyFor} in `server.types.ts`
 */
export type AuthServerApiEndpoints = Data.TaggedEnum<{
	SignInEmail: {};
	SignUpEmail: {};
	SignOut: {};
	GetSession: {};
	UpdateUser: {};
	SendVerificationEmail: {};
	ChangePassword: {};
	ForgetPassword: {};
	ResetPassword: {};
	SignInSocial: {};
	ListUserAccounts: {};
	UnlinkAccount: {};
	CallbackOAuth: {};
	VerifyEmail: {};
	ChangeEmail: {};
	SetPassword: {};
	DeleteUser: {};
	DeleteUserCallback: {};
	ForgetPasswordCallback: {};
	RequestPasswordReset: {};
	RequestPasswordResetCallback: {};
	ListSessions: {};
	RevokeSession: {};
	RevokeSessions: {};
	RevokeOtherSessions: {};
	LinkSocialAccount: {};
	RefreshToken: {};
	GetAccessToken: {};
	AccountInfo: {};
	Ok: {};
	Error: {};
}>;

export const AuthServerApiEndpoints = Data.taggedEnum<AuthServerApiEndpoints>();
