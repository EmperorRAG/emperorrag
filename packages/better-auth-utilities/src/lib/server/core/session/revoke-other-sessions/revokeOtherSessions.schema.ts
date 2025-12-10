/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-other-sessions/revokeOtherSessions.schema.ts
 * @description Zod validation schemas for server-side revoke other sessions operation.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerFor } from '../../../server.types';
import { createSchemaWithOptionalHeaders } from '../../shared/core.schema';

/**
 * Creates a dynamic Zod schema for revokeOtherSessions parameters.
 *
 * @pure
 * @description Generates a Zod schema for validating revoke other sessions parameters.
 *
 * @param _authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 */
export const createRevokeOtherSessionsServerParamsSchema = <T extends AuthServerFor = AuthServerFor>(_authServer: T) =>
	Effect.succeed(createSchemaWithOptionalHeaders());
