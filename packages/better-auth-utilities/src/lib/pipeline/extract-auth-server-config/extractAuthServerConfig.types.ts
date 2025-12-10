import type { BetterAuthOptions } from 'better-auth/types';

/**
 * Type alias for the Better Auth configuration object.
 */
export type AuthServerConfig = BetterAuthOptions;

/**
 * Valid keys for extracting specific configuration properties.
 */
export type AuthServerConfigKey = keyof AuthServerConfig;

/**
 * Scope definition for configuration extraction.
 * Can be a specific key or 'all' for the full configuration.
 */
export type AuthServerConfigScope = AuthServerConfigKey | 'all';

/**
 * Conditional type that determines the return type based on the extraction scope.
 * - If 'all', returns the full AuthServerConfig.
 * - If a specific key, returns a Pick of that key from AuthServerConfig.
 */
export type ExtractedAuthServerConfig<K extends AuthServerConfigScope> = K extends 'all'
	? AuthServerConfig
	: K extends AuthServerConfigKey
		? Pick<AuthServerConfig, K>
		: never;
