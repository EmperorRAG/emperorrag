/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/callback-oauth/callbackOAuth.schema.ts
 * @description Zod validation schemas for server-side OAuth callback operation.
 */

import * as Effect from 'effect/Effect';
import { z } from 'zod';
import { oauthQueryParamsOptionalSchema, requestOptionsOptionalHeadersShape } from '../../shared/core.schema';

/**
 * Creates a dynamic Zod schema for OAuth callback parameters.
 *
 * @pure
 * @description Generates a Zod schema for validating OAuth callback query parameters.
 *
 * @param _authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 */
export const createCallbackOAuthServerParamsSchema = () =>
	Effect.succeed(
		z.object({
			params: z.object({
				id: z.string(),
			}),
			query: oauthQueryParamsOptionalSchema,
			...requestOptionsOptionalHeadersShape,
		})
	);
