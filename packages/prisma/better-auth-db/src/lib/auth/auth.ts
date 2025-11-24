/**
 * @file services/my-nest-js-auth-microservice/src/lib/auth.ts
 * @description Better Auth configuration with comprehensive plugin support.
 * Uses the adapter pattern from better-auth-utilities for NestJS integration.
 */

import { PrismaClient } from '@prisma/client';
import { defineConfig, createServerConfig, createClientConfig } from '@emperorrag/better-auth-utilities/config/config';

// Import Better Auth plugins
import { username, jwt, bearer, admin, organization, /*emailOTP, twoFactor,*/ apiKey } from 'better-auth/plugins';
import { createAuthServer } from '@emperorrag/better-auth-utilities/server/server';
import { createAuthClient } from '@emperorrag/better-auth-utilities/client/client';

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
 * Creates a Better Auth client configured with the shared plugin suite and base settings.
 *
 * @remarks
 * This client export allows downstream applications—such as Next.js frontends or integration tests—
 * to perform typed operations against the Better Auth server using the same configuration used by
 * the microservice.
 */
export const authClient = createAuthClient(betterAuthConfig);
