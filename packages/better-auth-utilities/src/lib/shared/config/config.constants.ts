/**
 * @file libs/better-auth-utilities/src/lib/config/config.constants.ts
 * @description Constants for better-auth configuration.
 */

import type { ClientConfig, ServerConfig } from './config.types';

// ============================================================================
// DEFAULT VALUES
// ============================================================================

// Helper function to get base URL from environment or default
export function getBaseURL(): string {
	return process.env.BETTER_AUTH_URL || 'http://localhost:3000';
}

/**
 * Default server configuration values.
 * Export for users who want to extend these defaults.
 */
export const DEFAULT_SERVER_CONFIG: Partial<ServerConfig> = {
	appName: 'My Application',
	baseURL: getBaseURL(),
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 8,
		requireEmailVerification: false,
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24, // 1 day
		freshAge: 60 * 10, // 10 minutes
		cookieName: 'better-auth.session_token',
	},
	rateLimit: {
		enabled: true,
		window: 60,
		max: 10,
	},
	socialProviders: [],
	trustedOrigins: [],
};

/**
 * Default client configuration values.
 * Export for users who want to extend these defaults.
 */
export const DEFAULT_CLIENT_CONFIG: Partial<ClientConfig> = {
	redirectUri: '/dashboard',
	postLogoutRedirectUri: '/',
	scopes: ['openid', 'profile', 'email'],
	autoRefreshSession: true,
	fetchOptions: {
		credentials: 'include',
	},
};
