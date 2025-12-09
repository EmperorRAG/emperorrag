/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/sign-in-social/signInSocial.schema.ts
 * @description Zod schema generation for signInSocial server validation.
 * Provides dynamic schema creation based on Better Auth server configuration.
 */

import { Effect } from 'effect';
import { z } from 'zod';
import type { AuthServerFor } from '../../../server.types';
import { OAuthAuthServerServiceTag } from '../shared/oauth.service';
import type { OAuthAuthServerService } from '../shared/oauth.types';

/**
 * Creates a Zod schema for validating signInSocial server parameters.
 *
 * @pure
 * @description Dynamically generates a validation schema for OAuth sign-in parameters.
 * Returns an Effect that requires OAuthAuthServerService context and produces
 * the appropriate Zod schema for validating signInSocial input parameters.
 *
 * @param authServer - The Better Auth server instance (used for potential config extraction)
 * @returns Effect succeeding with a Zod schema for validating signInSocial input parameters
 *
 * @example
 * ```typescript
 * import { Effect } from 'effect';
 * import { OAuthAuthServerServiceTag } from '../shared/oauth.service';
 * import { createSignInSocialServerParamsSchema } from './signInSocial.schema';
 *
 * const program = Effect.gen(function* (_) {
 *   const { authServer } = yield* _(OAuthAuthServerServiceTag);
 *   const schema = yield* _(createSignInSocialServerParamsSchema(authServer));
 *
 *   // Validate incoming data
 *   const result = schema.safeParse({
 *     body: {
 *       provider: 'google',
 *       callbackURL: '/dashboard'
 *     },
 *     headers: request.headers
 *   });
 *
 *   if (result.success) {
 *     return result.data;
 *   } else {
 *     throw new Error('Validation failed');
 *   }
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Using with controller
 * const program = Effect.gen(function* (_) {
 *   const { authServer } = yield* _(OAuthAuthServerServiceTag);
 *   const schema = yield* _(createSignInSocialServerParamsSchema(authServer));
 *
 *   // Parse input
 *   const parsed = schema.safeParse(rawInput);
 *
 *   if (!parsed.success) {
 *     yield* _(Effect.fail(new OAuthAuthServerInputError(
 *       'Invalid input',
 *       parsed.error.issues
 *     )));
 *   }
 *
 *   return parsed.data;
 * });
 * ```
 */
export const createSignInSocialServerParamsSchema = <T extends AuthServerFor = AuthServerFor>(_authServer: T) =>
	Effect.succeed(
		z.object({
			body: z.object({
				provider: z.string().min(1, 'Provider is required'),
				callbackURL: z.string().url('Invalid callback URL').optional(),
				errorCallbackURL: z.string().url('Invalid error callback URL').optional(),
				newUserCallbackURL: z.string().url('Invalid new user callback URL').optional(),
				disableRedirect: z.boolean().optional(),
				idToken: z
					.object({
						token: z.string(),
						nonce: z.string().optional(),
						accessToken: z.string().optional(),
						refreshToken: z.string().optional(),
						expiresAt: z.number().optional(),
					})
					.optional(),
			}),
			headers: z.instanceof(Headers).optional(),
			asResponse: z.boolean().optional(),
			returnHeaders: z.boolean().optional(),
		})
	);

/**
 * Creates a Zod schema for validating signInSocial server parameters using Effect Context.
 *
 * @pure
 * @description Alternative version that retrieves authServer from context rather than parameter.
 * Useful when working within Effect pipelines where the service is already in context.
 *
 * @returns Effect requiring OAuthAuthServerService context, succeeding with a Zod schema
 *
 * @example
 * ```typescript
 * import { Effect } from 'effect';
 * import { createSignInSocialServerParamsSchemaFromContext } from './signInSocial.schema';
 *
 * const program = Effect.gen(function* (_) {
 *   const schema = yield* _(createSignInSocialServerParamsSchemaFromContext());
 *   const parsed = schema.safeParse(input);
 *   // ...
 * });
 *
 * await Effect.runPromise(
 *   Effect.provideService(program, OAuthAuthServerServiceTag, { authServer })
 * );
 * ```
 */
export const createSignInSocialServerParamsSchemaFromContext = (): Effect.Effect<
	z.ZodObject<{
		body: z.ZodObject<{
			provider: z.ZodString;
			callbackURL: z.ZodOptional<z.ZodString>;
			errorCallbackURL: z.ZodOptional<z.ZodString>;
			newUserCallbackURL: z.ZodOptional<z.ZodString>;
			disableRedirect: z.ZodOptional<z.ZodBoolean>;
			idToken: z.ZodOptional<
				z.ZodObject<{
					token: z.ZodString;
					nonce: z.ZodOptional<z.ZodString>;
					accessToken: z.ZodOptional<z.ZodString>;
					refreshToken: z.ZodOptional<z.ZodString>;
					expiresAt: z.ZodOptional<z.ZodNumber>;
				}>
			>;
		}>;
		headers: z.ZodOptional<z.ZodType<Headers>>;
		asResponse: z.ZodOptional<z.ZodBoolean>;
		returnHeaders: z.ZodOptional<z.ZodBoolean>;
	}>,
	never,
	OAuthAuthServerService
> => Effect.flatMap(OAuthAuthServerServiceTag, ({ authServer }) => createSignInSocialServerParamsSchema(authServer));
