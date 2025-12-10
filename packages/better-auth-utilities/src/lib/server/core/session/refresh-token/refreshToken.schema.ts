/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/refresh-token/refreshToken.schema.ts
 * @description Zod validation schemas for server-side refresh token operation.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerFor } from '../../../server.types';
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
export const createRefreshTokenServerParamsSchema = <T extends AuthServerFor = AuthServerFor>(_authServer: T) =>
	Effect.succeed(createSchemaWithOptionalHeaders());
