/**
 * @file libs/better-auth-utilities/src/lib/client.constants.ts
 * @description Client-side better-auth constants and plugin factory mappings.
 *
 * @remarks
 * Unlike server plugins, client plugins do not have individual subpath exports in better-auth.
 * The 'better-auth/client/plugins' bundle is the only available import path.
 * This is a limitation of the better-auth package structure, not an optimization choice.
 */

// =============================================================================
// Bundle Import (No individual subpaths available for client plugins)
// The 'better-auth/client/plugins' export does not provide individual plugin subpaths
// =============================================================================
import {
	apiKeyClient,
	twoFactorClient,
	adminClient,
	organizationClient,
	usernameClient,
	magicLinkClient,
	siweClient,
	genericOAuthClient,
	oneTapClient,
	anonymousClient,
	phoneNumberClient,
	emailOTPClient,
	lastLoginMethodClient,
	oneTimeTokenClient,
	multiSessionClient,
} from 'better-auth/client/plugins';
import type { AvailablePlugins } from '../shared/config/config.types';

/**
 * Maps plugin names to their client factory functions.
 * Note: Most client plugins don't accept configuration parameters.
 */
export const CLIENT_PLUGIN_FACTORIES: Record<
	AvailablePlugins,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(config?: unknown) => any
> = {
	// Core authentication plugins
	username: () => usernameClient(),
	magicLink: () => magicLinkClient(),
	twoFactor: (config) => twoFactorClient(config as Parameters<typeof twoFactorClient>[0]),
	admin: (config) => adminClient(config as Parameters<typeof adminClient>[0]),
	organization: (config) => organizationClient(config as Parameters<typeof organizationClient>[0]),
	passkey: () => {
		throw new Error('Passkey client plugin requires @better-auth/passkey package or correct import path');
	},

	// OAuth/Auth plugins
	oidc: () => {
		throw new Error('OIDC client plugin requires correct import or @better-auth/oidc package');
	},
	siwe: () => siweClient(),
	genericOAuth: () => genericOAuthClient(),
	oneTap: (config) => oneTapClient(config as Parameters<typeof oneTapClient>[0]),

	// Integration plugins (require separate packages)
	stripe: () => {
		throw new Error('Stripe client plugin requires @better-auth/stripe package');
	},
	polar: () => {
		throw new Error('Polar client plugin requires @polar-sh/better-auth package');
	},
	dodopayments: () => {
		throw new Error('Dodo Payments client plugin requires @dodopayments/better-auth package');
	},
	dubAnalytics: () => {
		throw new Error('Dub Analytics client plugin requires @dub/better-auth package');
	},

	// Security plugins
	bearer: () => {
		// Bearer plugin is typically server-only, no client plugin needed
		return null;
	},
	jwt: () => {
		// JWT client is available but typically included automatically
		return null;
	},
	apiKey: () => apiKeyClient(),
	haveIBeenPwned: () => {
		throw new Error('Have I Been Pwned client plugin requires @better-auth/hibp package');
	},

	// Advanced plugins
	multiSession: () => multiSessionClient(),
	anonymous: () => anonymousClient(),
	phoneNumber: () => phoneNumberClient(),
	emailOTP: () => emailOTPClient(),
	deviceAuthorization: () => {
		// Device authorization is typically server-only
		return null;
	},
	lastLoginMethod: () => lastLoginMethodClient(),
	oneTimeToken: () => oneTimeTokenClient(),
};
