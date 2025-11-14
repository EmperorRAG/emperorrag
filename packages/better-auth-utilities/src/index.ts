/**
 * @file libs/better-auth-utilities/src/index.ts
 * @description Public API for the better-auth-utilities library.
 */

export { createAuthServer, createClientConfig, createServerConfig, defineConfig, createAuthClient } from './lib/better-auth-utilities.js';

export type {
	AuthProvider,
	AvailablePlugins,
	BetterAuthConfig,
	ClientConfig,
	DEFAULT_CLIENT_CONFIG,
	DEFAULT_SERVER_CONFIG,
	AuthClientApiEndpointFor,
	AuthClientApiEndpointKeyFor,
	AuthClientApiFor,
	AuthClientApiKeyFor,
	AuthClientFor,
	AuthClientSignInFor,
	AuthClientSignUpFor,
	ServerConfig,
	AuthServerOf,
} from './lib/better-auth-utilities.ts';
