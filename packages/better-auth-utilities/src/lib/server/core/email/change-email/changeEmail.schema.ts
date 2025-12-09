/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/change-email/changeEmail.schema.ts
 * @description Zod validation schemas for server-side change email operation.
 */

import * as Effect from 'effect/Effect';
import { z } from 'zod';
import type { AuthServerFor } from '../../../server.types';

/**
 * Creates a dynamic Zod schema for changeEmail parameters.
 *
 * @pure
 * @description Generates a Zod schema that validates change email parameters.
 *
 * @param _authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 */
export const createChangeEmailServerParamsSchema = <T extends AuthServerFor = AuthServerFor>(_authServer: T) =>
	Effect.gen(function* () {
		const bodySchema = z.object({
			newEmail: z.string().email('Invalid email format'),
			callbackURL: z.string().url('Invalid callback URL').optional(),
		});

		return z.object({
			body: bodySchema,
			headers: z.instanceof(Headers).optional(),
			asResponse: z.boolean().optional(),
			returnHeaders: z.boolean().optional(),
		});
	});
