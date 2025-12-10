/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/reset-password/resetPassword.schema.ts
 * @description Zod validation schemas for server-side reset password operation.
 */

import * as Effect from 'effect/Effect';
import { z } from 'zod';
import type { AuthServerFor } from '../../../server.types';
import { getPasswordLengthConstraints } from '../../../../shared/config/config.utils';

/**
 * Creates a dynamic Zod schema for resetPassword parameters based on the AuthServer configuration.
 *
 * @pure
 * @description Generates a Zod schema that enforces password policies defined in the
 * Better Auth configuration. Extracts min/max password length from emailAndPassword config.
 *
 * @param authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 */
export const createResetPasswordServerParamsSchema = <T extends AuthServerFor = AuthServerFor>(authServer: T) =>
	Effect.gen(function* () {
		const { minPasswordLength, maxPasswordLength } = getPasswordLengthConstraints(authServer);

		const bodySchema = z.object({
			token: z.string().min(1, 'Reset token is required'),
			newPassword: z.string().min(minPasswordLength).max(maxPasswordLength),
		});

		return z.object({
			body: bodySchema,
			headers: z.instanceof(Headers).optional(),
			asResponse: z.boolean().optional(),
			returnHeaders: z.boolean().optional(),
		});
	});
