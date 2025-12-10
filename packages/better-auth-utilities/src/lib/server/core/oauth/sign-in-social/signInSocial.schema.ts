/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/sign-in-social/signInSocial.schema.ts
 * @description Zod schema generation for signInSocial server validation.
 * Provides dynamic schema creation based on Better Auth server configuration.
 */

import * as Effect from 'effect/Effect';
import { z } from 'zod';
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
