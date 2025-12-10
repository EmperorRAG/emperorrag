/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/list-sessions/listSessions.schema.ts
 * @description Zod validation schemas for server-side list sessions operation.
 */

import * as Effect from 'effect/Effect';
import { createSchemaWithOptionalHeaders } from '../../shared/core.schema';

/**
 * Creates a dynamic Zod schema for listSessions parameters.
 *
 * @pure
 * @description Generates a Zod schema that validates list sessions parameters.
 *
 * @param _authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 */
export const createListSessionsServerParamsSchema = () =>
	Effect.succeed(createSchemaWithOptionalHeaders());
