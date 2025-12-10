/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/sign-in-email/signInEmail.schema.ts
 * @description Zod validation schemas for server-side sign-in email operation.
 */

import * as Effect from 'effect/Effect';
import { z } from 'zod';
import type { AuthServerFor } from '../../../server.types';
import { getMinPasswordLength } from '../../../../shared/config/config.utils';
import { emailSchema, callbackURLOptionalSchema, rememberMeOptionalSchema, createBodySchemaWithOptionalHeaders } from '../../shared/core.schema';

/**
 * Creates a dynamic Zod schema for signInEmail parameters based on the AuthServer configuration.
 *
 * @pure
 * @description Generates a Zod schema that enforces password policies from the Better Auth configuration.
 *
 * @param authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 */
export const createSignInEmailServerParamsSchema = <T extends AuthServerFor = AuthServerFor>(authServer: T) =>
	Effect.gen(function* () {
		const minPasswordLength = getMinPasswordLength(authServer);

		const bodySchema = z.object({
			email: emailSchema,
			password: z.string().min(minPasswordLength, 'Password is required'),
			rememberMe: rememberMeOptionalSchema,
			callbackURL: callbackURLOptionalSchema,
		});

		return createBodySchemaWithOptionalHeaders(bodySchema);
	});
