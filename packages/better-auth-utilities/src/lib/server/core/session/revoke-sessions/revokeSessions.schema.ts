/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-sessions/revokeSessions.schema.ts
 * @description Zod validation schemas for server-side revoke all sessions operation.
 */

import * as Effect from 'effect/Effect';
import { createSchemaWithOptionalHeaders } from '../../shared/core.schema';

/**
 * Creates a dynamic Zod schema for revokeSessions parameters.
 *
 * @pure
 * @description Generates a Zod schema for validating revoke all sessions parameters.
 *
 * @param _authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 */
export const createRevokeSessionsServerParamsSchema = () =>
	Effect.succeed(createSchemaWithOptionalHeaders());
