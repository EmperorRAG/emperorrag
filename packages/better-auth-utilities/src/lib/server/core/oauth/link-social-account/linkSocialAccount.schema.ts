/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/link-social-account/linkSocialAccount.schema.ts
 * @description Zod validation schemas for server-side link social account operation.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerFor } from '../../../server.types';
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
export const createLinkSocialAccountServerParamsSchema = <T extends AuthServerFor = AuthServerFor>(_authServer: T) =>
	Effect.succeed(createBodySchemaWithOptionalHeaders(providerWithCallbackBodySchema));
