import * as Effect from 'effect/Effect';
import { AuthServerTag } from '../../server/server.service';
import type { AuthServerFor } from '../../server/server.types';
import type { AuthServerConfigScope, ExtractedAuthServerConfig, AuthServerConfig } from './extractAuthServerConfig.types';

/**
 * Extracts configuration from the AuthServer instance based on the provided scope.
 *
 * @pure
 * @description Retrieves the AuthServer from the context and extracts its configuration options.
 * Supports extracting the entire configuration ('all') or a specific property key.
 * Fails if the configuration options are not available on the server instance.
 *
 * @param scope - The scope of configuration to extract ('all' or a specific key).
 * @returns Effect that resolves to the extracted configuration.
 */
export const extractAuthServerConfig = <K extends AuthServerConfigScope>(scope: K): Effect.Effect<ExtractedAuthServerConfig<K>, Error, AuthServerFor> =>
	Effect.gen(function* () {
		const authServer = yield* AuthServerTag;

		// Accessing internal options property.
		// We cast to AuthServerConfig | undefined because 'options' is an internal property
		// that might not be strictly typed on the public AuthServer interface in all contexts.
		const options = authServer.options as AuthServerConfig | undefined;

		if (!options) {
			return yield* Effect.fail(new Error('AuthServer configuration options are not available'));
		}

		if (scope === 'all') {
			return options as unknown as ExtractedAuthServerConfig<K>;
		}

		const configKey = scope as keyof AuthServerConfig;
		const extracted = { [configKey]: options[configKey] };
		return extracted as unknown as ExtractedAuthServerConfig<K>;
	});
