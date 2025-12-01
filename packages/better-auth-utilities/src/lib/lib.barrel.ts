/**
 * @file libs/better-auth-utilities/src/lib/better-auth-utilities.ts
 * @description Main export file for better-auth-utilities library
 */

// Export configuration utilities
export { defineConfig, createClientConfig, createServerConfig } from './config/config.service';
export { DEFAULT_CLIENT_CONFIG, DEFAULT_SERVER_CONFIG } from './config/config.constants';
export type {
	AuthProvider,
	AvailablePlugins,
	BetterAuthConfig,
	ClientConfig,
	OAuthProviderId,
	PluginConfigRegistry,
	ServerConfig,
} from './config/config.types';

// Export server instance creation
export { createAuthServer } from './server/server.service';

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
} from './server/server.types';

// Export client instance creation
export { createAuthClient } from './client/client.service';
export type {
	AuthClientApiEndpointFor,
	AuthClientApiEndpointKeyFor,
	AuthClientApiFor,
	AuthClientApiKeyFor,
	AuthClientFor,
	AuthClientSignInFor,
	AuthClientSignUpFor,
} from './client/client.types';
