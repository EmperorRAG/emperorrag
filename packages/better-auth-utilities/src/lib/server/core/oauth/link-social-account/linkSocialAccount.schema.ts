/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/link-social-account/linkSocialAccount.schema.ts
 * @description Zod validation schemas for server-side link social account operation.
 */

import * as Effect from 'effect/Effect';
import { providerWithCallbackBodySchema, createBodySchemaWithOptionalHeaders } from '../../shared/core.schema';

/**
 * Creates a dynamic Zod schema for link social account parameters.
 *
 * @pure
 * @description Generates a Zod schema for validating link social account parameters.
 *
 * @param _authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 */
export const createLinkSocialAccountServerParamsSchema = () =>
	Effect.succeed(createBodySchemaWithOptionalHeaders(providerWithCallbackBodySchema));
