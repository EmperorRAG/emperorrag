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
	AuthClientApiEndpointArgsOf,
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

export const betterAuthConfig = defineConfig({
	server: serverConfig,
	client: clientConfig,
	enabledServerPlugins: ['jwt', 'admin', 'apiKey', 'bearer', 'username', 'organization'],
	enabledClientPlugins: ['jwt', 'admin', 'apiKey', 'bearer', 'username', 'organization'],
});

export const authServer = createAuthServer(betterAuthConfig, prisma);

export type AuthServer = AuthServerOf<typeof authServer>;
export type AuthServerApi = AuthServerApiOf<AuthServer>;
export type AuthServerApiEndpoint = AuthServerApiEndpointOf<AuthServer>;
export type AuthServerApiEndpointKeys = AuthServerApiEndpointKeyOf<AuthServer>;
export type AuthServerApiUpdateUserBody = AuthServerApiEndpointBody<AuthServer, 'updateUser'>;

export type AuthServerSession = AuthServerSessionOf<AuthServer>;
export type AuthServerSessionUserSession = AuthServerSessionUserSessionOf<AuthServer>;
export type AuthServerSessionUser = AuthServerSessionUserOf<AuthServer>;

export const authClient = createAuthClient(betterAuthConfig);

export type AuthClient = AuthClientOf<typeof authClient>;
export type AuthClientApi = AuthClientApiOf<AuthClient>;
export type AuthClientApiEndpoint = AuthClientApiEndpointOf<AuthClient>;
export type AuthClientApiEndpointKey = AuthClientApiEndpointKeyOf<AuthClient>;
export type AuthClientApiSignInArgs = AuthClientApiEndpointArgsOf<AuthClient, 'signIn'>;

export type AuthClientSession = AuthClientSessionOf<AuthClient>;
export type AuthClientSessionUserSession = AuthClientSessionUserSessionOf<AuthClient>;

export type AuthClientSessionUser = AuthClientSessionUserOf<AuthClient>;
