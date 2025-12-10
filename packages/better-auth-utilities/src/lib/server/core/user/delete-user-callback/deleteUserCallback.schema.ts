/**
 * @file libs/better-auth-utilities/src/lib/server/core/user/delete-user-callback/deleteUserCallback.schema.ts
 * @description Zod validation schemas for server-side delete user callback operation.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerFor } from '../../../server.types';
import { tokenQuerySchema, createQuerySchemaWithOptionalHeaders } from '../../shared/core.schema';

/**
 * Creates a dynamic Zod schema for deleteUserCallback parameters.
 *
 * @pure
 * @description Generates a Zod schema for validating delete user callback parameters.
 *
 * @param _authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 */
export const createDeleteUserCallbackServerParamsSchema = <T extends AuthServerFor = AuthServerFor>(_authServer: T) =>
	Effect.succeed(createQuerySchemaWithOptionalHeaders(tokenQuerySchema));
