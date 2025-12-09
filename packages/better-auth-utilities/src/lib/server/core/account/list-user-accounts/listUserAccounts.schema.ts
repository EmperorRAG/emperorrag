/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/list-user-accounts/listUserAccounts.schema.ts
 * @description Zod schema generation for listUserAccounts server validation.
 * Provides dynamic schema creation based on Better Auth server configuration.
 */

import { Effect } from 'effect';
import { z } from 'zod';
import { AccountAuthServerServiceTag } from '../shared/account.service';
import type { AccountAuthServerService } from '../shared/account.types';

/**
 * Creates a Zod schema for validating listUserAccounts server parameters.
 *
 * @pure
 * @description Dynamically generates a validation schema by extracting endpoint
 * configuration from the provided Better Auth server. Returns an Effect that
 * requires AccountAuthServerService context and produces the appropriate Zod schema.
 *
 * @returns Effect requiring AccountAuthServerService context, succeeding with a Zod schema
 *          for validating listUserAccounts input parameters
 *
 * @example
 * ```typescript
 * import { Effect } from 'effect';
 * import { AccountAuthServerServiceTag } from '../shared/account.service';
 * import { createListUserAccountsServerParamsSchema } from './listUserAccounts.schema';
 *
 * // Get schema via Effect
 * const schemaEffect = createListUserAccountsServerParamsSchema();
 *
 * const program = Effect.gen(function* (_) {
 *   const schema = yield* _(schemaEffect);
 *
 *   // Validate incoming data
 *   const result = schema.safeParse({
 *     headers: request.headers,
 *     asResponse: false
 *   });
 *
 *   if (result.success) {
 *     return result.data;
 *   } else {
 *     throw new Error('Validation failed');
 *   }
 * });
 *
 * // Provide the service context
 * const schema = await Effect.runPromise(
 *   Effect.provideService(program, AccountAuthServerServiceTag, { authServer })
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Using with controller
 * const program = Effect.gen(function* (_) {
 *   const schema = yield* _(createListUserAccountsServerParamsSchema());
 *
 *   // Parse input
 *   const parsed = schema.safeParse(rawInput);
 *
 *   if (!parsed.success) {
 *     yield* _(Effect.fail(new AccountAuthServerInputError({
 *       message: 'Invalid input',
 *       issues: parsed.error.issues
 *     })));
 *   }
 *
 *   return parsed.data;
 * });
 * ```
 */
export const createListUserAccountsServerParamsSchema = (): Effect.Effect<
	z.ZodObject<{
		headers: z.ZodType<Headers>;
		asResponse: z.ZodOptional<z.ZodBoolean>;
		returnHeaders: z.ZodOptional<z.ZodBoolean>;
	}>,
	never,
	AccountAuthServerService
> =>
	Effect.flatMap(AccountAuthServerServiceTag, ({ authServer: _authServer }) =>
		Effect.succeed(
			z.object({
				headers: z.instanceof(Headers, {
					message: 'headers must be an instance of Headers for session authentication',
				}),
				asResponse: z.boolean().optional(),
				returnHeaders: z.boolean().optional(),
			})
		)
	);
