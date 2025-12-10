/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/set-password/setPassword.schema.ts
 * @description Zod validation schemas for server-side set password operation.
 */

import * as Effect from 'effect/Effect';
import { z } from 'zod';
import type { AuthServerFor } from '../../../server.types';
import { getPasswordLengthConstraints } from '../../../../shared/config/config.utils';

/**
 * Creates a dynamic Zod schema for setPassword parameters based on the AuthServer configuration.
 *
 * @pure
 * @description Generates a Zod schema that enforces password policies from the Better Auth configuration.
 *
 * @param authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 */
export const createSetPasswordServerParamsSchema = <T extends AuthServerFor = AuthServerFor>(authServer: T) =>
	Effect.gen(function* () {
		const { minPasswordLength, maxPasswordLength } = getPasswordLengthConstraints(authServer);

		const bodySchema = z.object({
			newPassword: z.string().min(minPasswordLength).max(maxPasswordLength),
		});

		return z.object({
			body: bodySchema,
			headers: z.instanceof(Headers).optional(),
			asResponse: z.boolean().optional(),
			returnHeaders: z.boolean().optional(),
		});
	});
