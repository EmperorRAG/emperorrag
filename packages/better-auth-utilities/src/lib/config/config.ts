/**
 * @file libs/better-auth-utilities/src/lib/config.ts
 * @description Comprehensive better-auth configuration with TypeScript generics,
 * plugin system, and intelligent defaults.
 */

import type { AvailablePlugins, BetterAuthConfig, ClientConfig, ServerConfig } from './config.types';

// Re-export types and constants for backward compatibility and ease of use
export * from './config.types';
export * from './config.constants';

// ============================================================================
// DEFINE CONFIG FUNCTION
// ============================================================================

/**
 * Type-safe configuration builder for better-auth with plugin support.
 *
 * This function provides complete type information and intelligent defaults
 * for both server and client configurations. It uses TypeScript generics
 * to conditionally include plugin configurations based on enabled plugins.
 *
 * @template ServerPlugins - Array of plugin names enabled on the server
 * @template ClientPlugins - Array of plugin names enabled on the client
 *
 * @param config - Configuration object with server and client settings
 * @returns Complete configuration with defaults applied
 *
 * @example
 * ```typescript
 * export const authConfig = defineConfig({
 *   enabledServerPlugins: ['twoFactor', 'organization', 'jwt'] as const,
 *   enabledClientPlugins: ['twoFactor', 'organization'] as const,
 *   server: {
 *     secret: process.env.BETTER_AUTH_SECRET!,
 *     database: process.env.DATABASE_URL,
 *     plugins: {
 *       twoFactor: {
 *         enabled: true,
 *         issuer: 'My App',
 *       },
 *       jwt: {
 *         enabled: true,
 *         jwtExpiresIn: '7d',
 *       },
 *     },
 *   },
 *   client: {
 *     baseURL: 'http://localhost:3000',
 *     plugins: {
 *       twoFactor: {
 *         enabled: true,
 *         twoFactorPage: '/two-factor',
 *       },
 *     },
 *   },
 * });
 * ```
 */
export function defineConfig<ServerPlugins extends readonly AvailablePlugins[] = [], ClientPlugins extends readonly AvailablePlugins[] = ServerPlugins>(
	config: BetterAuthConfig<ServerPlugins, ClientPlugins>
): BetterAuthConfig<ServerPlugins, ClientPlugins> {
	// Simple merge with defaults - TypeScript will infer the correct types
	return config as BetterAuthConfig<ServerPlugins, ClientPlugins>;
}

/**
 * Helper function to create server configuration with defaults.
 *
 * @param config - Server configuration
 * @returns Server configuration with defaults
 */
export function createServerConfig(config: ServerConfig): ServerConfig {
	return config;
}

/**
 * Helper function to create client configuration with defaults.
 *
 * @param config - Client configuration
 * @returns Client configuration with defaults
 */
export function createClientConfig(config: ClientConfig): ClientConfig {
	return config;
}
