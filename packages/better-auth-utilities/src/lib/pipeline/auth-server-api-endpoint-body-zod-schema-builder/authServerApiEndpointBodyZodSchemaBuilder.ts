import * as Effect from 'effect/Effect';
import * as Match from 'effect/Match';
import { z } from 'zod';
import { extractAuthServerConfig } from '../extract-auth-server-config/extractAuthServerConfig';
import type { AuthServerFor } from '../../server/server.types';
import { AuthServerApiEndpoints } from '../../enums/authServerApiEndpoints.enum';

/**
 * Builds a Zod schema for the API endpoint body based on the provided endpoint.
 *
 * @pure
 * @description Retrieves the AuthServer configuration using `extractAuthServerConfig` and
 * generates a Zod schema tailored to the specific endpoint requirements.
 *
 * @param endpoint - The API endpoint to generate the schema for.
 * @returns Effect that resolves to the generated Zod schema.
 */
export const authServerApiEndpointBodyZodSchemaBuilder = <K extends AuthServerApiEndpoints>(endpoint: K): Effect.Effect<z.ZodSchema, Error, AuthServerFor> =>
	Effect.gen(function* () {
		return yield* Match.value(endpoint as AuthServerApiEndpoints).pipe(
			Match.when(AuthServerApiEndpoints.signInEmail, () =>
				Effect.gen(function* () {
					const config = yield* extractAuthServerConfig('emailAndPassword');
					const options = config?.emailAndPassword;
					const minPasswordLength = options?.minPasswordLength ?? 8;
					const maxPasswordLength = options?.maxPasswordLength ?? 32;
					return z.object({
						email: z.string().email(),
						password: z.string().min(minPasswordLength).max(maxPasswordLength),
					});
				})
			),
			Match.when(AuthServerApiEndpoints.signUpEmail, () =>
				Effect.gen(function* () {
					const config = yield* extractAuthServerConfig('emailAndPassword');
					const options = config?.emailAndPassword;
					const minPasswordLength = options?.minPasswordLength ?? 8;
					const maxPasswordLength = options?.maxPasswordLength ?? 32;
					return z.object({
						email: z.string().email(),
						password: z.string().min(minPasswordLength).max(maxPasswordLength),
						name: z.string().optional(),
						image: z.string().optional(),
					});
				})
			),
			Match.when(AuthServerApiEndpoints.signInSocial, () =>
				Effect.succeed(
					z.object({
						provider: z.string(),
						callbackURL: z.string().optional(),
					})
				)
			),
			Match.orElse(() => Effect.succeed(z.object({})))
		);
	});
