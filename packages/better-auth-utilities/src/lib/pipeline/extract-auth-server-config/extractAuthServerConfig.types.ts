import type { BetterAuthOptions } from 'better-auth/types';
import { AuthServerApiEndpoints } from '../../enums/authServerApiEndpoints.enum';

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
export type AuthServerConfigScope = AuthServerConfigKey | 'all' | AuthServerApiEndpoints;

/**
 * Mapping from AuthServerApiEndpoints to AuthServerConfigKey.
 */
export type EndpointToConfigKey<K> = K extends AuthServerApiEndpoints.signInEmail
	? 'emailAndPassword'
	: K extends AuthServerApiEndpoints.signUpEmail
		? 'emailAndPassword'
		: K extends AuthServerApiEndpoints.changePassword
			? 'emailAndPassword'
			: K extends AuthServerApiEndpoints.resetPassword
				? 'emailAndPassword'
				: K extends AuthServerApiEndpoints.setPassword
					? 'emailAndPassword'
					: never;

/**
 * Conditional type that determines the return type based on the extraction scope.
 * - If 'all', returns the full AuthServerConfig.
 * - If a specific key, returns a Pick of that key from AuthServerConfig.
 * - If an endpoint, returns the config associated with that endpoint.
 */
export type ExtractedAuthServerConfig<K extends AuthServerConfigScope> = K extends 'all'
	? AuthServerConfig
	: K extends AuthServerConfigKey
		? Pick<AuthServerConfig, K>
		: K extends AuthServerApiEndpoints
			? EndpointToConfigKey<K> extends keyof AuthServerConfig
				? Pick<AuthServerConfig, EndpointToConfigKey<K>>
				: never
			: never;
