/**
 * @file libs/better-auth-utilities/src/lib/core/user/server/update-user/updateUser.schema.ts
 * @description Zod validation schemas for server-side update user operation.
 */

import * as Effect from 'effect/Effect';
import { z } from 'zod';
import type { AuthServerFor } from '../../../server.types';

/**
 * Creates a dynamic Zod schema for updateUser parameters based on the AuthServer configuration.
 *
 * @pure
 * @description Generates a Zod schema that validates update user parameters.
 * All body fields are optional since users may update any subset of their profile.
 *
 * @param authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 */
export const createUpdateUserServerParamsSchema = <T extends AuthServerFor = AuthServerFor>(_authServer: T) =>
	Effect.gen(function* () {
		const bodySchema = z.object({
			name: z.string().min(1, 'Name cannot be empty').optional(),
			email: z.string().email('Invalid email format').optional(),
			image: z.string().url('Invalid image URL').nullable().optional(),
		});

		return z.object({
			body: bodySchema,
			headers: z.instanceof(Headers).optional(),
			asResponse: z.boolean().optional(),
			returnHeaders: z.boolean().optional(),
		});
	});
