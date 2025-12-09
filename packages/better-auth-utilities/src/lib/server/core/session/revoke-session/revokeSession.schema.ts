/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-session/revokeSession.schema.ts
 * @description Zod validation schemas for server-side revoke session operation.
 */

import * as Effect from 'effect/Effect';
import { z } from 'zod';
import type { AuthServerFor } from '../../../server.types';

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
	Effect.gen(function* () {
		const bodySchema = z.object({
			token: z.string().min(1, 'Session token is required'),
		});

		return z.object({
			body: bodySchema,
			headers: z.instanceof(Headers).optional(),
			asResponse: z.boolean().optional(),
			returnHeaders: z.boolean().optional(),
		});
	});
