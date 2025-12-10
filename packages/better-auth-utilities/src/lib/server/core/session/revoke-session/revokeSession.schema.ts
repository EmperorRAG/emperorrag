/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-session/revokeSession.schema.ts
 * @description Zod validation schemas for server-side revoke session operation.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerFor } from '../../../server.types';
import { sessionTokenBodySchema, createBodySchemaWithOptionalHeaders } from '../../shared/core.schema';

/**
 * Creates a dynamic Zod schema for revokeSession parameters.
 *
 * @pure
 * @description Generates a Zod schema that validates revoke session parameters.
 *
 * @param _authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 */
export const createRevokeSessionServerParamsSchema = <T extends AuthServerFor = AuthServerFor>(_authServer: T) =>
	Effect.succeed(createBodySchemaWithOptionalHeaders(sessionTokenBodySchema));
