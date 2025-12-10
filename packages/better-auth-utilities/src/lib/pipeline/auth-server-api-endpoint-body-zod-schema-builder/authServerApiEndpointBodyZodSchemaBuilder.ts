import * as Effect from 'effect/Effect';
import * as Match from 'effect/Match';
import { z } from 'zod';
import { extractAuthServerConfig } from '../extract-auth-server-config/extractAuthServerConfig';
import type { AuthServerConfigScope, AuthServerConfig } from '../extract-auth-server-config/extractAuthServerConfig.types';
import type { AuthServerFor } from '../../server/server.types';

/**
 * Builds a Zod schema for the API endpoint body based on the provided configuration scope.
 *
 * @pure
 * @description Retrieves the AuthServer configuration using `extractAuthServerConfig` and
 * generates a Zod schema tailored to the specific configuration options (e.g., password length).
 *
 * @param scope - The scope of configuration to use for schema generation.
 * @returns Effect that resolves to the generated Zod schema.
 */
export const authServerApiEndpointBodyZodSchemaBuilder = <K extends AuthServerConfigScope>(scope: K): Effect.Effect<z.ZodSchema, Error, AuthServerFor> =>
	Effect.gen(function* () {
		const config = yield* extractAuthServerConfig(scope);

		return Match.value(scope as AuthServerConfigScope).pipe(
			Match.when('emailAndPassword', () => {
				const c = config as Pick<AuthServerConfig, 'emailAndPassword'>;
				const options = c.emailAndPassword;
				const minPasswordLength = options?.minPasswordLength ?? 8;
				const maxPasswordLength = options?.maxPasswordLength ?? 32;
				return z.object({
					email: z.string().email(),
					password: z.string().min(minPasswordLength).max(maxPasswordLength),
					name: z.string().optional(),
					image: z.string().optional(),
				});
			}),
			Match.when('socialProviders', () => {
				return z.object({
					provider: z.string(),
					callbackURL: z.string().optional(),
				});
			}),
			Match.orElse(() => z.object({}))
		);
	});
