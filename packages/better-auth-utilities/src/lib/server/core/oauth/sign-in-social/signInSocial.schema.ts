/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/sign-in-social/signInSocial.schema.ts
 * @description Zod schema generation for signInSocial server validation.
 * Provides dynamic schema creation based on Better Auth server configuration.
 */

import { Effect } from 'effect';
import { z } from 'zod';
import { OAuthAuthServerServiceTag } from '../shared/oauth.service';
import type { OAuthAuthServerService } from '../shared/oauth.types';
import {
	providerRequiredSchema,
	callbackURLOptionalSchema,
	errorCallbackURLOptionalSchema,
	newUserCallbackURLOptionalSchema,
	disableRedirectOptionalSchema,
	idTokenOptionalSchema,
	requestOptionsOptionalHeadersShape,
} from '../../shared/core.schema';

/**
 * Creates a Zod schema for validating signInSocial server parameters.
 *
 * @pure
 * @description Dynamically generates a validation schema for OAuth sign-in parameters.
 * Returns an Effect that requires OAuthAuthServerService context and produces
 * the appropriate Zod schema for validating signInSocial input parameters.
 *
 * @param _authServer - The Better Auth server instance (used for potential config extraction)
 * @returns Effect succeeding with a Zod schema for validating signInSocial input parameters
 */
export const createSignInSocialServerParamsSchema = () =>
	Effect.succeed(
		z.object({
			body: z.object({
				provider: providerRequiredSchema,
				callbackURL: callbackURLOptionalSchema,
				errorCallbackURL: errorCallbackURLOptionalSchema,
				newUserCallbackURL: newUserCallbackURLOptionalSchema,
				disableRedirect: disableRedirectOptionalSchema,
				idToken: idTokenOptionalSchema,
			}),
			...requestOptionsOptionalHeadersShape,
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
 */
export const createSignInSocialServerParamsSchemaFromContext = (): Effect.Effect<
	ReturnType<typeof createSignInSocialServerParamsSchema> extends Effect.Effect<infer A, infer _E, infer _R> ? A : never,
	never,
	OAuthAuthServerService
> => Effect.flatMap(OAuthAuthServerServiceTag, ({ authServer }) => createSignInSocialServerParamsSchema());
