/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/change-password/changePassword.schema.ts
 * @description Zod validation schemas for server-side change password operation.
 */

import { pipe } from 'effect';
import * as Effect from 'effect/Effect';
import * as Option from 'effect/Option';
import { z } from 'zod';
import type { AuthServerFor } from '../../../server.types';
import { getAuthServerConfig, getEmailAndPasswordConfig } from '../shared/email.utils';

/**
 * Creates a dynamic Zod schema for changePassword parameters based on the AuthServer configuration.
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
 * import { createChangePasswordServerParamsSchema } from './changePassword.schema';
 *
 * const program = Effect.gen(function* (_) {
 *   const schema = yield* _(createChangePasswordServerParamsSchema(authServer));
 *   const result = schema.safeParse(params);
 *   if (!result.success) {
 *     console.error('Validation failed:', result.error);
 *   }
 * });
 * ```
 */
export const createChangePasswordServerParamsSchema = <T extends AuthServerFor = AuthServerFor>(authServer: T) =>
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
			currentPassword: z.string().min(1, 'Current password is required'),
			newPassword: z.string().min(minPasswordLength).max(maxPasswordLength),
			revokeOtherSessions: z.boolean().optional(),
		});

		return z.object({
			body: bodySchema,
			headers: z.instanceof(Headers, { message: 'Headers instance required for session identification' }),
			asResponse: z.boolean().optional(),
			returnHeaders: z.boolean().optional(),
		});
	});
