/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/reset-password/resetPassword.schema.ts
 * @description Zod validation schemas for server-side reset password operation.
 */

import { pipe } from 'effect';
import * as Effect from 'effect/Effect';
import * as Option from 'effect/Option';
import { z } from 'zod';
import type { AuthServerFor } from '../../../server.types';
import { getAuthServerConfig, getEmailAndPasswordConfig } from '../shared/email.utils';

/**
 * Creates a dynamic Zod schema for resetPassword parameters based on the AuthServer configuration.
 *
 * @pure
 * @description Generates a Zod schema that enforces password policies defined in the
 * Better Auth configuration. Extracts min/max password length from emailAndPassword config.
 *
 * @param authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { createResetPasswordServerParamsSchema } from './resetPassword.schema';
 *
 * const program = Effect.gen(function* (_) {
 *   const schema = yield* _(createResetPasswordServerParamsSchema(authServer));
 *   const result = schema.safeParse(params);
 *   if (!result.success) {
 *     console.error('Validation failed:', result.error);
 *   }
 * });
 * ```
 */
export const createResetPasswordServerParamsSchema = <T extends AuthServerFor = AuthServerFor>(authServer: T) =>
	Effect.gen(function* () {
		const config = getAuthServerConfig(authServer);

		const passwordConfig = pipe(config, Option.flatMap(getEmailAndPasswordConfig));

		const minPasswordLength = pipe(
			passwordConfig,
			Option.flatMap((c) => Option.fromNullable(c.minPasswordLength)),
			Option.getOrElse(() => 8)
		);

		const maxPasswordLength = pipe(
			passwordConfig,
			Option.flatMap((c) => Option.fromNullable(c.maxPasswordLength)),
			Option.getOrElse(() => 32)
		);

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
