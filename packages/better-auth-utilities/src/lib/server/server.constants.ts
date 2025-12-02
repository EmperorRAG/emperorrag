/**
 * @file libs/better-auth-utilities/src/lib/server/server.constants.ts
 * @description Server-side better-auth constants and plugin factory mappings.
 *
 * @remarks
 * This file uses granular subpath imports from better-auth to optimize TS Server performance.
 * Each plugin is imported from its dedicated subpath (e.g., 'better-auth/plugins/admin')
 * instead of the bundled 'better-auth/plugins' export to reduce type resolution overhead.
 */

// =============================================================================
// Individual Plugin Subpath Imports (Optimized for TS Server Performance)
// =============================================================================

// Core authentication plugins (ACTIVE)
import { admin } from 'better-auth/plugins/admin';
import { bearer } from 'better-auth/plugins/bearer';
import { emailOTP } from 'better-auth/plugins/email-otp';
import { jwt } from 'better-auth/plugins/jwt';
import { organization } from 'better-auth/plugins/organization';
import { twoFactor } from 'better-auth/plugins/two-factor';
import { username } from 'better-auth/plugins/username';

// =============================================================================
// Commented Out Plugin Imports (Not Currently Used)
// These plugins are defined in AvailablePlugins but not enabled in any config.
// Uncomment when needed to reduce TS Server type resolution overhead.
// =============================================================================
// import { anonymous } from 'better-auth/plugins/anonymous';
// import { deviceAuthorization } from 'better-auth/plugins/device-authorization';
// import { genericOAuth } from 'better-auth/plugins/generic-oauth';
// import { magicLink } from 'better-auth/plugins/magic-link';
// import { multiSession } from 'better-auth/plugins/multi-session';
// import { oneTimeToken } from 'better-auth/plugins/one-time-token';
// import { phoneNumber } from 'better-auth/plugins/phone-number';
// import { siwe } from 'better-auth/plugins/siwe';

// =============================================================================
// Bundle Import (Required for plugins without individual subpaths)
// These plugins are only exported from the 'better-auth/plugins' bundle
// =============================================================================
import { apiKey, openAPI } from 'better-auth/plugins';

// Commented out - not currently used:
// import { oneTap, lastLoginMethod } from 'better-auth/plugins';

// =============================================================================
// Commented Out Original Bundle Import (For Reference)
// The following import was replaced with individual subpath imports above.
// Uncomment if you need to revert to bundle import for any reason.
// =============================================================================
// import {
// 	apiKey,
// 	bearer,
// 	jwt,
// 	openAPI,
// 	twoFactor,
// 	admin,
// 	organization,
// 	username,
// 	magicLink,
// 	siwe,
// 	genericOAuth,
// 	oneTap,
// 	anonymous,
// 	phoneNumber,
// 	emailOTP,
// 	deviceAuthorization,
// 	lastLoginMethod,
// 	oneTimeToken,
// 	multiSession,
// } from 'better-auth/plugins';

import type { AvailablePlugins } from '../shared/config/config.types';

/**
 * Maps plugin names to their server factory functions.
 * Server plugins typically accept more configuration parameters than client plugins.
 *
 * @pure
 * @description Each plugin factory accepts an optional configuration object and returns a plugin instance.
 * Server plugins often include:
 * - **Callback functions** for operations like sending emails, OTPs, or magic links
 * - **Security configurations** for cryptographic algorithms, token formats, and validation
 * - **Database operations** that interact directly with Prisma adapter
 * - **Business logic** for authorization checks and user management
 *
 * @remarks
 * - All server plugins accept configuration objects as their first parameter
 * - Some plugins require external packages (passkey, oidc, stripe, polar, dodopayments, dubAnalytics, haveIBeenPwned)
 * - The openAPI plugin is always included automatically in createAuthServer
 * - Server-only plugins (bearer, jwt, deviceAuthorization) have no client equivalents
 * - Integration plugins (stripe, polar, dodopayments, dubAnalytics) require separate npm packages
 *
 * @example
 * ```typescript
 * // Usage in createAuthServer
 * const factory = SERVER_PLUGIN_FACTORIES['username'];
 * const plugin = factory({ minUsernameLength: 3, maxUsernameLength: 50 });
 *
 * // Server-specific configuration with callbacks
 * const emailOTPPlugin = SERVER_PLUGIN_FACTORIES['emailOTP']({
 *   expiresIn: '5m',
 *   sendOTP: async ({ email, code }) => {
 *     await sendEmail(email, `Your code is: ${code}`);
 *   }
 * });
 * ```
 */
export const SERVER_PLUGIN_FACTORIES: Record<
	AvailablePlugins,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(config?: unknown) => any
> = {
	// Core authentication plugins (ACTIVE)
	username: (config) => username(config as Parameters<typeof username>[0]),
	twoFactor: (config) => twoFactor(config as Parameters<typeof twoFactor>[0]),
	admin: (config) => admin(config as Parameters<typeof admin>[0]),
	organization: (config) => organization(config as Parameters<typeof organization>[0]),

	// Core authentication plugins (COMMENTED OUT - uncomment import and factory when needed)
	magicLink: () => {
		throw new Error('MagicLink plugin is commented out. Uncomment import in server.constants.ts to enable.');
	},
	passkey: () => {
		throw new Error('Passkey plugin requires @better-auth/passkey package or correct import path');
	},

	// OAuth/Auth plugins (COMMENTED OUT)
	oidc: () => {
		throw new Error('OIDC plugin requires correct import or @better-auth/oidc package');
	},
	siwe: () => {
		throw new Error('SIWE plugin is commented out. Uncomment import in server.constants.ts to enable.');
	},
	genericOAuth: () => {
		throw new Error('GenericOAuth plugin is commented out. Uncomment import in server.constants.ts to enable.');
	},
	oneTap: () => {
		throw new Error('OneTap plugin is commented out. Uncomment import in server.constants.ts to enable.');
	},

	// Integration plugins (require separate packages)
	stripe: () => {
		throw new Error('Stripe plugin requires @better-auth/stripe package');
	},
	polar: () => {
		throw new Error('Polar plugin requires @polar-sh/better-auth package');
	},
	dodopayments: () => {
		throw new Error('Dodo Payments plugin requires @dodopayments/better-auth package');
	},
	dubAnalytics: () => {
		throw new Error('Dub Analytics plugin requires @dub/better-auth package');
	},

	// Security plugins (ACTIVE)
	bearer: (config) => bearer(config as Parameters<typeof bearer>[0]),
	jwt: (config) => jwt(config as Parameters<typeof jwt>[0]),
	apiKey: (config) => apiKey(config as Parameters<typeof apiKey>[0]),
	haveIBeenPwned: () => {
		throw new Error('Have I Been Pwned plugin requires @better-auth/hibp package');
	},

	// Advanced plugins (ACTIVE)
	emailOTP: (config) => emailOTP(config as Parameters<typeof emailOTP>[0]),

	// Advanced plugins (COMMENTED OUT)
	multiSession: () => {
		throw new Error('MultiSession plugin is commented out. Uncomment import in server.constants.ts to enable.');
	},
	anonymous: () => {
		throw new Error('Anonymous plugin is commented out. Uncomment import in server.constants.ts to enable.');
	},
	phoneNumber: () => {
		throw new Error('PhoneNumber plugin is commented out. Uncomment import in server.constants.ts to enable.');
	},
	deviceAuthorization: () => {
		throw new Error('DeviceAuthorization plugin is commented out. Uncomment import in server.constants.ts to enable.');
	},
	lastLoginMethod: () => {
		throw new Error('LastLoginMethod plugin is commented out. Uncomment import in server.constants.ts to enable.');
	},
	oneTimeToken: () => {
		throw new Error('OneTimeToken plugin is commented out. Uncomment import in server.constants.ts to enable.');
	},
};

/**
 * Server plugins that are always included automatically in createAuthServer.
 *
 * @pure
 * @description The OpenAPI plugin is automatically added to every Better Auth server instance
 * to provide interactive API documentation at the `/api/auth/openapi.json` endpoint.
 * This enables automatic generation of client SDKs and API testing tools.
 *
 * @remarks
 * - OpenAPI plugin requires no configuration
 * - Endpoint is always available at `{baseURL}/api/auth/openapi.json`
 * - Documentation includes all enabled plugins and their endpoints
 * - Compatible with tools like Swagger UI, Postman, and OpenAPI Generator
 *
 * @example
 * ```typescript
 * // OpenAPI is automatically included in createAuthServer
 * const auth = createAuthServer(config, prisma);
 * // Access at: http://localhost:3000/api/auth/openapi.json
 *
 * // Manual usage (not required in createAuthServer):
 * const openAPIPlugin = ALWAYS_INCLUDED_SERVER_PLUGINS.openAPI();
 * ```
 */
export const ALWAYS_INCLUDED_SERVER_PLUGINS = {
	openAPI: openAPI,
} as const;
