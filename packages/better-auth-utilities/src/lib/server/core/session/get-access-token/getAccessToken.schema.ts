/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/get-access-token/getAccessToken.schema.ts
 * @description Zod validation schemas for server-side get access token operation.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerFor } from '../../../server.types';
import { createSchemaWithOptionalHeaders } from '../../shared/core.schema';

/**
 * Creates a dynamic Zod schema for getAccessToken parameters.
 *
 * @pure
 * @description Generates a Zod schema for validating get access token parameters.
 *
 * @param _authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 */
export const createGetAccessTokenServerParamsSchema = <T extends AuthServerFor = AuthServerFor>(_authServer: T) =>
	Effect.succeed(createSchemaWithOptionalHeaders());
