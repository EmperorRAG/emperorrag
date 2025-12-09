/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/forget-password/forgetPassword.schema.ts
 * @description Zod validation schemas for server-side forget password operation.
 */

import * as Effect from 'effect/Effect';
import { z } from 'zod';
import type { AuthServerFor } from '../../../server.types';

/**
 * Creates a dynamic Zod schema for forgetPassword parameters based on the AuthServer configuration.
 *
 * @pure
 * @description Generates a Zod schema for validating forget password parameters.
 * The schema validates email format and optional redirect URL.
 *
 * @param authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { createForgetPasswordServerParamsSchema } from './forgetPassword.schema';
 *
 * const program = Effect.gen(function* (_) {
 *   const schema = yield* _(createForgetPasswordServerParamsSchema(authServer));
 *   const result = schema.safeParse(params);
 *   if (!result.success) {
 *     console.error('Validation failed:', result.error);
 *   }
 * });
 * ```
 */
export const createForgetPasswordServerParamsSchema = <T extends AuthServerFor = AuthServerFor>(_authServer: T) =>
	Effect.gen(function* () {
		const bodySchema = z.object({
			email: z.string().email('Invalid email format'),
			redirectTo: z.string().url('Invalid redirect URL').optional(),
		});

		return z.object({
			body: bodySchema,
			headers: z.instanceof(Headers).optional(),
			asResponse: z.boolean().optional(),
			returnHeaders: z.boolean().optional(),
		});
	});
