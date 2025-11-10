/**
 * @file services/my-nest-js-auth-microservice/src/lib/auth.ts
 * @description Better Auth configuration with comprehensive plugin support.
 * Uses the adapter pattern from better-auth-utilities for NestJS integration.
 */

import { PrismaClient } from '../prisma/generated/client/index';
import { defineConfig, createServerConfig, createClientConfig } from '@emperorrag/better-auth-utilities/config';

// Import Better Auth plugins
import { username, jwt, bearer, admin, organization, /*emailOTP, twoFactor,*/ apiKey } from 'better-auth/plugins';
import { createAuthServer } from '@emperorrag/better-auth-utilities/server';
import type {
	AuthServerSessionOf,
	AuthServerOf,
	AuthServerSessionUserSessionOf,
	AuthServerSessionUserOf,
	AuthServerApiOf,
	AuthServerApiEndpointOf,
	AuthServerApiEndpointKeyOf,
	AuthServerApiEndpointBody,
} from '@emperorrag/better-auth-utilities/server';
import { createAuthClient } from '@emperorrag/better-auth-utilities/client';
import type {
	AuthClientSessionOf,
	AuthClientOf,
	AuthClientSessionUserSessionOf,
	AuthClientSessionUserOf,
	AuthClientApiOf,
	AuthClientApiEndpointOf,
	AuthClientApiEndpointKeyOf,
	AuthClientErrorOf,
} from '@emperorrag/better-auth-utilities/client';

// Initialize Prisma Client
// Note: In production, this should be managed by the PrismaService
const prisma = new PrismaClient();

const plugins = {
	// Username authentication support (3-50 characters)
	username: username({
		minUsernameLength: 3,
		maxUsernameLength: 50,
	}),

	// JWT token support
	jwt: jwt(),

	// Bearer token support
	bearer: bearer(),

	// Admin role management
	admin: admin({ adminUserIds: [process.env.BETTER_AUTH_NEST_JS_MICROSERVICE_USER_ID ?? '0', process.env.BETTER_AUTH_NEXT_JS_FRONTEND_USER_ID ?? '1'] }),

	// Organization/multi-tenancy support
	organization: organization(),

	// DON'T REMOVE
	// Email OTP authentication (6-digit OTP, 5 minutes expiry)
	/*emailOTP({
		otpLength: 6,
		expiresIn: 300, // 5 minutes
		async sendVerificationOTP({ email, otp, type }) {
			// TODO: Implement email sending logic
			console.log(`Sending OTP ${otp} to ${email} (type: ${type})`);
			// In production, integrate with an email service like SendGrid, AWS SES, etc.
			// type can be: 'sign-in', 'email-verification', or 'password-reset'
		},
	}),*/

	// DON'T REMOVE
	// Two-factor authentication with TOTP
	/*twoFactor({
		issuer: 'My Auth Service',
		otpOptions: {
			async sendOTP({ user, otp }) {
				// TODO: Implement OTP delivery (email, SMS, etc.)
				console.log(`Sending 2FA OTP to user ${user.id}: ${otp}`);
				// In production, integrate with an email/SMS service
			},
		},
	}),*/

	// API key management
	apiKey: apiKey(),
};

const serverConfig = createServerConfig({
	secret: process.env.BETTER_AUTH_SECRET || 'default-development-secret-change-in-production',
	// Email and password authentication
	emailAndPassword: {
		enabled: true,
	},
	// Session configuration
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days in seconds
		updateAge: 60 * 60 * 24, // 1 day in seconds
	},
	// CORS configuration
	trustedOrigins: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:4200'],
	plugins: plugins,
});

const clientConfig = createClientConfig({ plugins: plugins });

/**
 * Resolves the unified Better Auth configuration shared between server and client helpers.
 *
 * @remarks
 * Combines the explicit plugin map with explicit server and client configuration builders so that
 * both `createAuthServer` and `createAuthClient` receive an equivalent shape. Environment defaults
 * provide sensible fallbacks for local development yet remain overrideable via process variables.
 */
export const betterAuthConfig = defineConfig({
	server: serverConfig,
	client: clientConfig,
	enabledServerPlugins: ['jwt', 'admin', 'apiKey', 'bearer', 'username', 'organization'],
	enabledClientPlugins: ['jwt', 'admin', 'apiKey', 'bearer', 'username', 'organization'],
});

/**
 * Initializes the Better Auth server using the Prisma adapter and shared configuration.
 *
 * @remarks
 * The Prisma client instance is injected to satisfy Better Auth's persistence requirements. This
 * server export is the primary entry point for NestJS modules as well as other runtime hosts that
 * expect a configured Better Auth HTTP handler.
 */
export const authServer = createAuthServer(betterAuthConfig, prisma);

/**
 * Strongly typed Better Auth server instance derived from {@link authServer}.
 */
export type AuthServer = AuthServerOf<typeof authServer>;
/**
 * Exposes the Better Auth server API surface for consumers needing endpoint contracts.
 */
export type AuthServerApi = AuthServerApiOf<AuthServer>;
/**
 * Represents any callable Better Auth server endpoint.
 */
export type AuthServerApiEndpoint = AuthServerApiEndpointOf<AuthServer>;
/**
 * Enumerates all available Better Auth server endpoint keys.
 */
export type AuthServerApiEndpointKeys = AuthServerApiEndpointKeyOf<AuthServer>;
type AuthServerEndpointBodyFor<TKey extends string> =
	Extract<AuthServerApiEndpointKeyOf<AuthServer>, TKey> extends infer TMapped
		? TMapped extends AuthServerApiEndpointKeyOf<AuthServer>
			? AuthServerApiEndpointBody<AuthServer, TMapped>
			: never
		: never;

export type AuthServerApiAccountInfoBody = AuthServerEndpointBodyFor<'accountInfo'>;
export type AuthServerApiCallbackOAuthBody = AuthServerEndpointBodyFor<'callbackOAuth'>;
export type AuthServerApiChangeEmailBody = AuthServerEndpointBodyFor<'changeEmail'>;
export type AuthServerApiChangePasswordBody = AuthServerEndpointBodyFor<'changePassword'>;
export type AuthServerApiDeleteUserBody = AuthServerEndpointBodyFor<'deleteUser'>;
export type AuthServerApiDeleteUserCallbackBody = AuthServerEndpointBodyFor<'deleteUserCallback'>;
export type AuthServerApiForgetPasswordBody = AuthServerEndpointBodyFor<'forgetPassword'>;
export type AuthServerApiForgetPasswordCallbackBody = AuthServerEndpointBodyFor<'forgetPasswordCallback'>;
export type AuthServerApiGetAccessTokenBody = AuthServerEndpointBodyFor<'getAccessToken'>;
export type AuthServerApiGetSessionBody = AuthServerEndpointBodyFor<'getSession'>;
export type AuthServerApiLinkSocialAccountBody = AuthServerEndpointBodyFor<'linkSocialAccount'>;
export type AuthServerApiListSessionsBody = AuthServerEndpointBodyFor<'listSessions'>;
export type AuthServerApiListUserAccountsBody = AuthServerEndpointBodyFor<'listUserAccounts'>;
export type AuthServerApiRefreshTokenBody = AuthServerEndpointBodyFor<'refreshToken'>;
export type AuthServerApiRequestPasswordResetBody = AuthServerEndpointBodyFor<'requestPasswordReset'>;
export type AuthServerApiRequestPasswordResetCallbackBody = AuthServerEndpointBodyFor<'requestPasswordResetCallback'>;
export type AuthServerApiResetPasswordBody = AuthServerEndpointBodyFor<'resetPassword'>;
export type AuthServerApiRevokeOtherSessionsBody = AuthServerEndpointBodyFor<'revokeOtherSessions'>;
export type AuthServerApiRevokeSessionBody = AuthServerEndpointBodyFor<'revokeSession'>;
export type AuthServerApiRevokeSessionsBody = AuthServerEndpointBodyFor<'revokeSessions'>;
export type AuthServerApiSendVerificationEmailBody = AuthServerEndpointBodyFor<'sendVerificationEmail'>;
export type AuthServerApiSetPasswordBody = AuthServerEndpointBodyFor<'setPassword'>;
export type AuthServerApiSignInEmailBody = AuthServerEndpointBodyFor<'signInEmail'>;
export type AuthServerApiSignInSocialBody = AuthServerEndpointBodyFor<'signInSocial'>;
export type AuthServerApiSignOutBody = AuthServerEndpointBodyFor<'signOut'>;
export type AuthServerApiSignUpEmailBody = AuthServerEndpointBodyFor<'signUpEmail'>;
export type AuthServerApiUnlinkAccountBody = AuthServerEndpointBodyFor<'unlinkAccount'>;
export type AuthServerApiUpdateUserBody = AuthServerEndpointBodyFor<'updateUser'>;
export type AuthServerApiVerifyEmailBody = AuthServerEndpointBodyFor<'verifyEmail'>;

/**
 * Captures the Better Auth session payload exposed by the server.
 */
export type AuthServerSession = AuthServerSessionOf<AuthServer>;
/**
 * Provides direct access to the session metadata portion of a Better Auth session.
 */
export type AuthServerSessionUserSession = AuthServerSessionUserSessionOf<AuthServer>;
/**
 * Extracts the user record embedded within a Better Auth session.
 */
export type AuthServerSessionUser = AuthServerSessionUserOf<AuthServer>;

/**
 * Creates a Better Auth client configured with the shared plugin suite and base settings.
 *
 * @remarks
 * This client export allows downstream applications—such as Next.js frontends or integration tests—
 * to perform typed operations against the Better Auth server using the same configuration used by
 * the microservice.
 */
export const authClient = createAuthClient(betterAuthConfig);

/**
 * Strongly typed Better Auth client instance derived from {@link authClient}.
 */
export type AuthClient = AuthClientOf<typeof authClient>;
/**
 * Exposes the Better Auth client API subset, including plugin augmentations.
 */
export type AuthClientApi = AuthClientApiOf<AuthClient>;

type AuthClientApiMemberArgs<TKey extends keyof AuthClientApi> = AuthClientApi[TKey] extends (...args: infer TParameters) => unknown
	? TParameters extends [infer TFirst, ...unknown[]]
		? TFirst extends { body: infer TBody }
			? TBody
			: TFirst
		: never
	: never;

type AuthClientEndpointArgsFor<TKey extends string> =
	Extract<keyof AuthClientApi, TKey> extends infer TMapped ? (TMapped extends keyof AuthClientApi ? AuthClientApiMemberArgs<TMapped> : never) : never;
/**
 * Represents any callable Better Auth client endpoint, including plugin-provided members.
 */
export type AuthClientApiEndpoint = AuthClientApiEndpointOf<AuthClient>;
/**
 * Enumerates all exposed Better Auth client endpoint keys.
 */
export type AuthClientApiEndpointKey = AuthClientApiEndpointKeyOf<AuthClient>;
/**
 * Surfaces the Better Auth error catalogue exposed by the client implementation.
 */
export type AuthClientError = AuthClientErrorOf<AuthClient>;

/**
 * Describes the argument contract for the high-level `signIn` Better Auth client endpoint.
 */
export type AuthClientApiAccountInfoArgs = AuthClientEndpointArgsFor<'accountInfo'>;
export type AuthClientApiChangeEmailArgs = AuthClientEndpointArgsFor<'changeEmail'>;
export type AuthClientApiChangePasswordArgs = AuthClientEndpointArgsFor<'changePassword'>;
export type AuthClientApiDeleteUserArgs = AuthClientEndpointArgsFor<'deleteUser'>;
export type AuthClientApiForgetPasswordArgs = AuthClientEndpointArgsFor<'forgetPassword'>;
export type AuthClientApiGetAccessTokenArgs = AuthClientEndpointArgsFor<'getAccessToken'>;
export type AuthClientApiGetSessionArgs = AuthClientEndpointArgsFor<'getSession'>;
export type AuthClientApiLinkSocialArgs = AuthClientEndpointArgsFor<'linkSocial'>;
export type AuthClientApiListAccountsArgs = AuthClientEndpointArgsFor<'listAccounts'>;
export type AuthClientApiListSessionsArgs = AuthClientEndpointArgsFor<'listSessions'>;
export type AuthClientApiRefreshTokenArgs = AuthClientEndpointArgsFor<'refreshToken'>;
export type AuthClientApiRequestPasswordResetArgs = AuthClientEndpointArgsFor<'requestPasswordReset'>;
export type AuthClientApiResetPasswordArgs = AuthClientEndpointArgsFor<'resetPassword'>;
export type AuthClientApiRevokeOtherSessionsArgs = AuthClientEndpointArgsFor<'revokeOtherSessions'>;
export type AuthClientApiRevokeSessionArgs = AuthClientEndpointArgsFor<'revokeSession'>;
export type AuthClientApiRevokeSessionsArgs = AuthClientEndpointArgsFor<'revokeSessions'>;
export type AuthClientApiSendVerificationEmailArgs = AuthClientEndpointArgsFor<'sendVerificationEmail'>;
export type AuthClientApiSignInArgs = AuthClientEndpointArgsFor<'signIn'>;
export type AuthClientApiSignOutArgs = AuthClientEndpointArgsFor<'signOut'>;
export type AuthClientApiSignUpArgs = AuthClientEndpointArgsFor<'signUp'>;
export type AuthClientApiUnlinkAccountArgs = AuthClientEndpointArgsFor<'unlinkAccount'>;
export type AuthClientApiUpdateUserArgs = AuthClientEndpointArgsFor<'updateUser'>;
export type AuthClientApiUseSessionArgs = AuthClientEndpointArgsFor<'useSession'>;
export type AuthClientApiVerifyEmailArgs = AuthClientEndpointArgsFor<'verifyEmail'>;
/**
 * Captures the Better Auth session payload returned by client helpers.
 */
export type AuthClientSession = AuthClientSessionOf<AuthClient>;
/**
 * Provides direct access to the session metadata portion returned via the client.
 */
export type AuthClientSessionUserSession = AuthClientSessionUserSessionOf<AuthClient>;

/**
 * Extracts the user record embedded inside a Better Auth session from the client perspective.
 */
export type AuthClientSessionUser = AuthClientSessionUserOf<AuthClient>;
