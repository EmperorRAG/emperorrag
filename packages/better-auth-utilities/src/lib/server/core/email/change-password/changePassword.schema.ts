/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/change-password/changePassword.schema.ts
 * @description Zod validation schemas for server-side change password operation.
 */

import * as Effect from 'effect/Effect';
import { z } from 'zod';
import type { AuthServerFor } from '../../../server.types';
import { getPasswordLengthConstraints } from '../../../../shared/config/config.utils';
import {
	currentPasswordRequiredSchema,
	revokeOtherSessionsOptionalSchema,
	createPasswordSchema,
	createBodySchemaWithRequiredHeaders,
} from '../../shared/core.schema';

/**
 * Creates a dynamic Zod schema for changePassword parameters based on the AuthServer configuration.
 *
 * @pure
 * @description Generates a Zod schema that enforces password policies defined in the
 * Better Auth configuration. Extracts min/max password length from emailAndPassword config.
 *
 * @param authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 */
export const createChangePasswordServerParamsSchema = <T extends AuthServerFor = AuthServerFor>(authServer: T) =>
	Effect.gen(function* () {
		const { minPasswordLength, maxPasswordLength } = getPasswordLengthConstraints(authServer);

		const bodySchema = z.object({
			currentPassword: currentPasswordRequiredSchema,
			newPassword: createPasswordSchema(minPasswordLength, maxPasswordLength),
			revokeOtherSessions: revokeOtherSessionsOptionalSchema,
		});

		return createBodySchemaWithRequiredHeaders(bodySchema);
	});
