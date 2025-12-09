/**
 * @file libs/better-auth-utilities/src/lib/server/core/user/delete-user/deleteUser.schema.ts
 * @description Zod validation schemas for server-side delete user operation.
 */

import * as Effect from 'effect/Effect';
import { z } from 'zod';
import type { AuthServerFor } from '../../../server.types';

/**
 * Creates a dynamic Zod schema for deleteUser parameters.
 *
 * @pure
 * @description Generates a Zod schema that validates delete user parameters.
 *
 * @param _authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 */
export const createDeleteUserServerParamsSchema = <T extends AuthServerFor = AuthServerFor>(_authServer: T) =>
	Effect.gen(function* () {
		const bodySchema = z
			.object({
				password: z.string().optional(),
				callbackURL: z.string().url('Invalid callback URL').optional(),
				token: z.string().optional(),
			})
			.optional();

		return z.object({
			body: bodySchema,
			headers: z.instanceof(Headers).optional(),
			asResponse: z.boolean().optional(),
			returnHeaders: z.boolean().optional(),
		});
	});
