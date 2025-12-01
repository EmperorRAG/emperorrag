/**
 * @file libs/better-auth-utilities/src/index.ts
 * @description Public API for the better-auth-utilities library.
 */

export { createAuthServer, createClientConfig, createServerConfig, defineConfig, createAuthClient } from './lib/lib.barrel';

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
} from './lib/lib.barrel';
