/**
 * @file libs/better-auth-utilities/src/lib/server/server.constants.ts
 * @description Server-side better-auth constants and plugin factory mappings.
 */

import {
	apiKey,
	bearer,
	jwt,
	openAPI,
	twoFactor,
	admin,
	organization,
	username,
	magicLink,
	siwe,
	genericOAuth,
	oneTap,
	anonymous,
	phoneNumber,
	emailOTP,
	deviceAuthorization,
	lastLoginMethod,
	oneTimeToken,
	multiSession,
} from 'better-auth/plugins';
import type { AvailablePlugins } from '../config/config.ts';

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
	// Core authentication plugins
	username: (config) => username(config as Parameters<typeof username>[0]),
	magicLink: (config) => magicLink(config as Parameters<typeof magicLink>[0]),
	twoFactor: (config) => twoFactor(config as Parameters<typeof twoFactor>[0]),
	admin: (config) => admin(config as Parameters<typeof admin>[0]),
	organization: (config) => organization(config as Parameters<typeof organization>[0]),
	passkey: () => {
		throw new Error('Passkey plugin requires @better-auth/passkey package or correct import path');
	},

	// OAuth/Auth plugins
	oidc: () => {
		throw new Error('OIDC plugin requires correct import or @better-auth/oidc package');
	},
	siwe: (config) => siwe(config as Parameters<typeof siwe>[0]),
	genericOAuth: (config) => genericOAuth(config as Parameters<typeof genericOAuth>[0]),
	oneTap: (config) => oneTap(config as Parameters<typeof oneTap>[0]),

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

	// Security plugins
	bearer: (config) => bearer(config as Parameters<typeof bearer>[0]),
	jwt: (config) => jwt(config as Parameters<typeof jwt>[0]),
	apiKey: (config) => apiKey(config as Parameters<typeof apiKey>[0]),
	haveIBeenPwned: () => {
		throw new Error('Have I Been Pwned plugin requires @better-auth/hibp package');
	},

	// Advanced plugins
	multiSession: (config) => multiSession(config as Parameters<typeof multiSession>[0]),
	anonymous: (config) => anonymous(config as Parameters<typeof anonymous>[0]),
	phoneNumber: (config) => phoneNumber(config as Parameters<typeof phoneNumber>[0]),
	emailOTP: (config) => emailOTP(config as Parameters<typeof emailOTP>[0]),
	deviceAuthorization: (config) => deviceAuthorization(config as Parameters<typeof deviceAuthorization>[0]),
	lastLoginMethod: (config) => lastLoginMethod(config as Parameters<typeof lastLoginMethod>[0]),
	oneTimeToken: (config) => oneTimeToken(config as Parameters<typeof oneTimeToken>[0]),
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
