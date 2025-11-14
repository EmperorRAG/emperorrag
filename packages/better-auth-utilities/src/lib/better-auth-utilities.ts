/**
 * @file libs/better-auth-utilities/src/lib/better-auth-utilities.ts
 * @description Main export file for better-auth-utilities library
 */

// Export configuration utilities
export { defineConfig, createClientConfig, createServerConfig } from './config.js';
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
} from './config.ts';

// Export server instance creation
export { createAuthServer } from './server.js';
export type { AuthServerOf, AuthServerSessionOf } from './server.ts';

// Export client instance creation
export { createAuthClient } from './client.js';
export type {
	InferAuthClient,
	AuthClient,
	AuthClientOf,
	AuthClientApiOf,
	AuthClientApiKeyOf,
	AuthClientApiEndpointKeyOf,
	AuthClientApiEndpointOf,
	AuthClientApiEndpointAtPath,
	AuthClientApiEndpointParametersOf,
	AuthClientApiEndpointFirstParameter,
	AuthClientApiEndpointArgsOf,
	AuthClientSessionOf,
	AuthClientSessionUserSessionOf,
	AuthClientSessionUserOf,
	AuthClientErrorOf,
} from './client.ts';
