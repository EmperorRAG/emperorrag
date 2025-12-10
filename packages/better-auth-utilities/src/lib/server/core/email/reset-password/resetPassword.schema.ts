/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/reset-password/resetPassword.schema.ts
 * @description Zod validation schemas for server-side reset password operation.
 */

import * as Effect from 'effect/Effect';
import { z } from 'zod';
import type { AuthServer } from '../../../server.types';
import { getPasswordLengthConstraints } from '../../../../shared/config/config.utils';
import { resetTokenRequiredSchema, createPasswordSchema, createBodySchemaWithOptionalHeaders } from '../../shared/core.schema';

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
export const createResetPasswordServerParamsSchema = (authServer: AuthServer) =>
	Effect.gen(function* () {
		const { minPasswordLength, maxPasswordLength } = getPasswordLengthConstraints(authServer);

		const bodySchema = z.object({
			token: resetTokenRequiredSchema,
			newPassword: createPasswordSchema(minPasswordLength, maxPasswordLength),
		});

		return createBodySchemaWithOptionalHeaders(bodySchema);
	});
