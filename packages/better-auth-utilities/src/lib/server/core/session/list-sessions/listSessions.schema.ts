/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/list-sessions/listSessions.schema.ts
 * @description Zod validation schemas for server-side list sessions operation.
 */

import * as Effect from 'effect/Effect';
import { z } from 'zod';
import type { AuthServerFor } from '../../../server.types';

/**
 * Creates a dynamic Zod schema for listSessions parameters.
 *
 * @pure
 * @description Generates a Zod schema that validates list sessions parameters.
 *
 * @param _authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 */
export const createListSessionsServerParamsSchema = <T extends AuthServerFor = AuthServerFor>(_authServer: T) =>
	Effect.gen(function* () {
		return z.object({
			headers: z.instanceof(Headers).optional(),
			asResponse: z.boolean().optional(),
			returnHeaders: z.boolean().optional(),
		});
	});
