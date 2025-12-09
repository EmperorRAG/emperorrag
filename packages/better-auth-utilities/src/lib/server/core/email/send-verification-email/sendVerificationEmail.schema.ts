/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/send-verification-email/sendVerificationEmail.schema.ts
 * @description Zod validation schemas for server-side send verification email operation.
 */

import * as Effect from 'effect/Effect';
import { z } from 'zod';
import type { AuthServerFor } from '../../../server.types';

/**
 * Creates a dynamic Zod schema for sendVerificationEmail parameters based on the AuthServer configuration.
 *
 * @pure
 * @description Generates a Zod schema for validating send verification email parameters.
 * The schema validates email format and optional callback URL.
 *
 * @param authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { createSendVerificationEmailServerParamsSchema } from './sendVerificationEmail.schema';
 *
 * const program = Effect.gen(function* (_) {
 *   const schema = yield* _(createSendVerificationEmailServerParamsSchema(authServer));
 *   const result = schema.safeParse(params);
 *   if (!result.success) {
 *     console.error('Validation failed:', result.error);
 *   }
 * });
 * ```
 */
export const createSendVerificationEmailServerParamsSchema = <T extends AuthServerFor = AuthServerFor>(_authServer: T) =>
	Effect.gen(function* () {
		const bodySchema = z.object({
			email: z.string().email('Invalid email format'),
			callbackURL: z.string().url('Invalid callback URL').optional(),
		});

		return z.object({
			body: bodySchema,
			headers: z.instanceof(Headers).optional(),
			asResponse: z.boolean().optional(),
			returnHeaders: z.boolean().optional(),
		});
	});
