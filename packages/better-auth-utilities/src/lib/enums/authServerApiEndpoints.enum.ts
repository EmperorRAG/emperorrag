/**
 * Enum representing the available API endpoints on the Better Auth server.
 *
 * @description This enum provides string constants for all API methods exposed by the Better Auth server instance.
 * It corresponds to the keys of the `api` property on the server instance and can be used for
 * type-safe reference to endpoint names in configuration, routing, or client generation.
 *
 * @see {@link AuthServerApiEndpointKeyFor} in `server.types.ts`
 */
export enum AuthServerApiEndpoints {
	signInEmail = 'signInEmail',
	signUpEmail = 'signUpEmail',
	signOut = 'signOut',
	getSession = 'getSession',
	updateUser = 'updateUser',
	sendVerificationEmail = 'sendVerificationEmail',
	changePassword = 'changePassword',
	forgetPassword = 'forgetPassword',
	resetPassword = 'resetPassword',
	signInSocial = 'signInSocial',
	listUserAccounts = 'listUserAccounts',
	unlinkAccount = 'unlinkAccount',
	callbackOAuth = 'callbackOAuth',
	verifyEmail = 'verifyEmail',
	changeEmail = 'changeEmail',
	setPassword = 'setPassword',
	deleteUser = 'deleteUser',
	deleteUserCallback = 'deleteUserCallback',
	forgetPasswordCallback = 'forgetPasswordCallback',
	requestPasswordReset = 'requestPasswordReset',
	requestPasswordResetCallback = 'requestPasswordResetCallback',
	listSessions = 'listSessions',
	revokeSession = 'revokeSession',
	revokeSessions = 'revokeSessions',
	revokeOtherSessions = 'revokeOtherSessions',
	linkSocialAccount = 'linkSocialAccount',
	refreshToken = 'refreshToken',
	getAccessToken = 'getAccessToken',
	accountInfo = 'accountInfo',
	ok = 'ok',
	error = 'error',
}
