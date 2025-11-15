/**
 * @file libs/better-auth-utilities/src/lib/better-auth-utilities.ts
 * @description Main export file for better-auth-utilities library
 */

// Export configuration utilities
export { defineConfig, createClientConfig, createServerConfig } from './config/config.js';
export type {
	AuthProvider,
	AvailablePlugins,
	BetterAuthConfig,
	ClientConfig,
	DEFAULT_CLIENT_CONFIG,
	DEFAULT_SERVER_CONFIG,
	OAuthProviderId,
	PluginConfigRegistry,
	ServerConfig,
} from './config/config.ts';

// Export server instance creation
export { createAuthServer } from './server/server.js';
export type { AuthServerOf, AuthServerSessionOf } from './server/server.ts';

// Export server types
export type {
	AuthServerFor,
	AuthServerApiKeyFor,
	AuthServerApiFor,
	AuthServerApiEndpointKeyFor,
	AuthServerApiEndpointFor,
	AuthServerSessionFor,
	AuthServerSessionUserFor,
	AuthServerSessionUserSessionFor,
	AuthServerSignInFor,
	AuthServerSignUpFor,
} from './server/server.types.ts';

// Export client instance creation
export { createAuthClient } from './client/client.js';
export type {
	AuthClientApiEndpointFor,
	AuthClientApiEndpointKeyFor,
	AuthClientApiFor,
	AuthClientApiKeyFor,
	AuthClientFor,
	AuthClientSignInFor,
	AuthClientSignUpFor,
} from './client/client.types.ts';
