/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/refresh-token/refreshToken.schema.ts
 * @description Zod validation schemas for server-side refresh token operation.
 */

import * as Effect from 'effect/Effect';
import { createSchemaWithOptionalHeaders } from '../../shared/core.schema';

/**
 * Creates a dynamic Zod schema for refreshToken parameters.
 *
 * @pure
 * @description Generates a Zod schema for validating refresh token parameters.
 *
 * @param _authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 */
export const createRefreshTokenServerParamsSchema = () =>
	Effect.succeed(createSchemaWithOptionalHeaders());
