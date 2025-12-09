/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/unlink-account/unlinkAccount.schema.ts
 * @description Zod validation schemas for server-side unlink account operation.
 */

import * as Effect from 'effect/Effect';
import { z } from 'zod';
import type { AuthServerFor } from '../../../server.types';

/**
 * Creates a dynamic Zod schema for unlinkAccount parameters based on the AuthServer configuration.
 *
 * @pure
 * @description Generates a Zod schema for validating unlink account parameters.
 * The schema validates provider ID, headers (required), and request options.
 *
 * @param authServer - The Better Auth server instance
 * @returns Effect.Effect<z.ZodSchema> - The generated Zod schema
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { createUnlinkAccountServerParamsSchema } from './unlinkAccount.schema';
 *
 * const program = Effect.gen(function* (_) {
 *   const schema = yield* _(createUnlinkAccountServerParamsSchema(authServer));
 *   const result = schema.safeParse(params);
 *   if (!result.success) {
 *     console.error('Validation failed:', result.error);
 *   }
 * });
 * ```
 */
export const createUnlinkAccountServerParamsSchema = <T extends AuthServerFor = AuthServerFor>(_authServer: T) =>
	Effect.gen(function* () {
		const bodySchema = z.object({
			providerId: z.string().min(1, 'Provider ID is required'),
		});

		return z.object({
			body: bodySchema,
			headers: z.instanceof(Headers, { message: 'Headers instance required for session identification' }),
			asResponse: z.boolean().optional(),
			returnHeaders: z.boolean().optional(),
		});
	});
