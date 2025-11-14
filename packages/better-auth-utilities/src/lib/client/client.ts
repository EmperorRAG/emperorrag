/**
 * @file libs/better-auth-utilities/src/lib/client.ts
 * @description Client-side better-auth instance creation with full plugin support.
 */

import { createAuthClient as createBetterAuthClientCore } from 'better-auth/client';
import type { BetterAuthConfig, AvailablePlugins } from '../config/config.js';
import { CLIENT_PLUGIN_FACTORIES } from './client.constants.js';

/**
 * Creates a fully configured better-auth client instance from a BetterAuthConfig.
 *
 * This factory function:
 * - Takes a type-safe configuration object
 * - Initializes all enabled client plugins with their configurations
 * - Sets up base URL, redirect URIs, scopes, and fetch options
 * - Returns a ready-to-use better-auth client instance
 *
 * @template ServerPlugins - Array of plugin names enabled on the server
 * @template ClientPlugins - Array of plugin names enabled on the client
 *
 * @param config - Complete better-auth configuration
 * @returns Configured better-auth client instance
 *
 * @example
 * ```typescript
 * import { createAuthClient } from '@/lib/better-auth-utilities';
 * import { authConfig } from '@/config/auth.config';
 *
 * export const authClient = createAuthClient(authConfig);
 *
 * // Type-safe API usage
 * await authClient.signIn.email({ email, password });
 * await authClient.signOut();
 * const { data: session } = authClient.useSession();
 *
 * // Plugin methods are available based on config
 * await authClient.twoFactor.enable({ password });
 * await authClient.organization.create({ name, slug });
 * ```
 */
export function createAuthClient<ServerPlugins extends readonly AvailablePlugins[] = [], ClientPlugins extends readonly AvailablePlugins[] = ServerPlugins>(
	config: BetterAuthConfig<ServerPlugins, ClientPlugins>
): ReturnType<typeof createBetterAuthClientCore> {
	// Collect enabled client plugins
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const plugins: any[] = [];

	// Add enabled client plugins
	const enabledPlugins = config.enabledClientPlugins || config.enabledServerPlugins || ([] as readonly AvailablePlugins[]);

	for (const pluginName of enabledPlugins) {
		const factory = CLIENT_PLUGIN_FACTORIES[pluginName];
		if (!factory) {
			console.warn(`Unknown client plugin: ${pluginName}`);
			continue;
		}

		try {
			// Get plugin configuration from client.plugins
			const pluginConfig = config.client.plugins?.[pluginName];
			const plugin = factory(pluginConfig);

			// Only add non-null plugins (some server-only plugins return null)
			if (plugin !== null) {
				plugins.push(plugin);
			}
		} catch (error) {
			console.error(`Failed to initialize client plugin ${pluginName}:`, error);
			// Don't throw - allow partial plugin initialization
		}
	}

	return createBetterAuthClientCore({
		baseURL: config.client.baseURL || config.server.baseURL || process.env.BETTER_AUTH_URL || 'http://localhost:3000',

		// Fetch options
		fetchOptions: {
			onSuccess: config.client.fetchOptions?.onSuccess,
			onError: config.client.fetchOptions?.onError,
			credentials: config.client.fetchOptions?.credentials || 'include',
		},

		// Add all plugins - cast to any to avoid type mismatch between plugin versions
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		plugins: plugins as any,
	});
}
