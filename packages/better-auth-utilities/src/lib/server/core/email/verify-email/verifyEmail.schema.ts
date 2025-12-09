/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/verify-email/verifyEmail.schema.ts
 * @description Zod validation schemas for server-side verify email operation.
 */

import * as Effect from 'effect/Effect';
import { z } from 'zod';
import type { AuthServerFor } from '../../../server.types';

/**
 * Creates a dynamic Zod schema for verifyEmail parameters.
 *
 * @pure
 * @description Generates a Zod schema that validates verify email parameters.
 *
 * @param _authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 */
export const createVerifyEmailServerParamsSchema = <T extends AuthServerFor = AuthServerFor>(_authServer: T) =>
	Effect.gen(function* () {
		const querySchema = z.object({
			token: z.string().min(1, 'Token is required'),
		});

		return z.object({
			query: querySchema,
			headers: z.instanceof(Headers).optional(),
			asResponse: z.boolean().optional(),
			returnHeaders: z.boolean().optional(),
		});
	});
