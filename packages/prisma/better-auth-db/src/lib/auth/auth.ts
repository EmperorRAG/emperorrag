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
	AuthServerEndpointBodyFor,
} from '@emperorrag/better-auth-utilities/server';
import { createAuthClient } from '@emperorrag/better-auth-utilities/client';

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
export type AuthServerApiAccountInfoBody = AuthServerEndpointBodyFor<AuthServer, 'accountInfo'>;
export type AuthServerApiCallbackOAuthBody = AuthServerEndpointBodyFor<AuthServer, 'callbackOAuth'>;
export type AuthServerApiChangeEmailBody = AuthServerEndpointBodyFor<AuthServer, 'changeEmail'>;
export type AuthServerApiChangePasswordBody = AuthServerEndpointBodyFor<AuthServer, 'changePassword'>;
export type AuthServerApiDeleteUserBody = AuthServerEndpointBodyFor<AuthServer, 'deleteUser'>;
export type AuthServerApiDeleteUserCallbackBody = AuthServerEndpointBodyFor<AuthServer, 'deleteUserCallback'>;
export type AuthServerApiForgetPasswordBody = AuthServerEndpointBodyFor<AuthServer, 'forgetPassword'>;
export type AuthServerApiForgetPasswordCallbackBody = AuthServerEndpointBodyFor<AuthServer, 'forgetPasswordCallback'>;
export type AuthServerApiGetAccessTokenBody = AuthServerEndpointBodyFor<AuthServer, 'getAccessToken'>;
export type AuthServerApiGetSessionBody = AuthServerEndpointBodyFor<AuthServer, 'getSession'>;
export type AuthServerApiLinkSocialAccountBody = AuthServerEndpointBodyFor<AuthServer, 'linkSocialAccount'>;
export type AuthServerApiListSessionsBody = AuthServerEndpointBodyFor<AuthServer, 'listSessions'>;
export type AuthServerApiListUserAccountsBody = AuthServerEndpointBodyFor<AuthServer, 'listUserAccounts'>;
export type AuthServerApiRefreshTokenBody = AuthServerEndpointBodyFor<AuthServer, 'refreshToken'>;
export type AuthServerApiRequestPasswordResetBody = AuthServerEndpointBodyFor<AuthServer, 'requestPasswordReset'>;
export type AuthServerApiRequestPasswordResetCallbackBody = AuthServerEndpointBodyFor<AuthServer, 'requestPasswordResetCallback'>;
export type AuthServerApiResetPasswordBody = AuthServerEndpointBodyFor<AuthServer, 'resetPassword'>;
export type AuthServerApiRevokeOtherSessionsBody = AuthServerEndpointBodyFor<AuthServer, 'revokeOtherSessions'>;
export type AuthServerApiRevokeSessionBody = AuthServerEndpointBodyFor<AuthServer, 'revokeSession'>;
export type AuthServerApiRevokeSessionsBody = AuthServerEndpointBodyFor<AuthServer, 'revokeSessions'>;
export type AuthServerApiSendVerificationEmailBody = AuthServerEndpointBodyFor<AuthServer, 'sendVerificationEmail'>;
export type AuthServerApiSetPasswordBody = AuthServerEndpointBodyFor<AuthServer, 'setPassword'>;
export type AuthServerApiSignInEmailBody = AuthServerEndpointBodyFor<AuthServer, 'signInEmail'>;
export type AuthServerApiSignInSocialBody = AuthServerEndpointBodyFor<AuthServer, 'signInSocial'>;
export type AuthServerApiSignOutBody = AuthServerEndpointBodyFor<AuthServer, 'signOut'>;
export type AuthServerApiSignUpEmailBody = AuthServerEndpointBodyFor<AuthServer, 'signUpEmail'>;
export type AuthServerApiUnlinkAccountBody = AuthServerEndpointBodyFor<AuthServer, 'unlinkAccount'>;
export type AuthServerApiUpdateUserBody = AuthServerEndpointBodyFor<AuthServer, 'updateUser'>;
export type AuthServerApiVerifyEmailBody = AuthServerEndpointBodyFor<AuthServer, 'verifyEmail'>;

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
 * Type alias for the Better Auth client instance.
 *
 * @remarks
 * Consumers can use this type or `typeof authClient` directly for type inference.
 */
export type AuthClient = typeof authClient;
