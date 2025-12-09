/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/list-user-accounts/listUserAccounts.controller.ts
 * @description Controller for listUserAccounts server operations with input validation.
 * Combines schema validation with service execution in a type-safe manner.
 */

import { Effect } from 'effect';
import { AccountAuthServerApiError, AccountAuthServerDataMissingError, AccountAuthServerInputError } from '../shared/account.error';
import { AccountAuthServerServiceTag } from '../shared/account.service';
import type { AccountAuthServerService } from '../shared/account.types';
import { createListUserAccountsServerParamsSchema } from './listUserAccounts.schema';
import { listUserAccountsServerService } from './listUserAccounts.service';
import {
	isAuthServerApiListUserAccountsParamsFor,
	type AuthServerApiListUserAccountsParamsFor,
	type AuthServerApiListUserAccountsResultFor,
} from './listUserAccounts.types';

/**
 * Controller for server-side listUserAccounts operations with validation.
 *
 * @pure
 * @description Validates input using a dynamically generated Zod schema, then executes
 * the listUserAccounts service with the validated parameters. Uses Effect's Context layer
 * to access the authServer dependency and type guards for runtime type narrowing.
 *
 * @param input - Raw input parameters to validate and process
 * @returns Effect requiring AccountAuthServerService context, failing with validation or API errors,
 *          and succeeding with the accounts list result
 *
 * @example
 * ```typescript
 * import { Effect } from 'effect';
 * import { AccountAuthServerServiceTag } from '../shared/account.service';
 * import { listUserAccountsServerController } from './listUserAccounts.controller';
 *
 * // Handle incoming request
 * const program = listUserAccountsServerController({
 *   headers: request.headers
 * });
 *
 * // Provide the AuthServer dependency
 * const result = await Effect.runPromise(
 *   Effect.provideService(program, AccountAuthServerServiceTag, { authServer })
 * );
 *
 * // result is Account[]
 * console.log(`Found ${result.length} linked accounts`);
 * ```
 *
 * @example
 * ```typescript
 * // Error handling in controller
 * const program = listUserAccountsServerController(rawInput).pipe(
 *   Effect.catchTag('AccountAuthServerInputError', (e) =>
 *     Effect.succeed({ error: 'validation_failed', issues: e.issues })
 *   ),
 *   Effect.catchTag('AccountAuthServerApiError', (e) =>
 *     Effect.succeed({ error: 'api_error', status: e.status })
 *   )
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Using with Express/Next.js route handler
 * export async function GET(request: Request) {
 *   const program = listUserAccountsServerController({
 *     headers: request.headers
 *   });
 *
 *   try {
 *     const accounts = await Effect.runPromise(
 *       Effect.provideService(program, AccountAuthServerServiceTag, { authServer })
 *     );
 *     return Response.json({ accounts });
 *   } catch (error) {
 *     return Response.json({ error: 'Failed to fetch accounts' }, { status: 500 });
 *   }
 * }
 * ```
 */
export const listUserAccountsServerController = (
	input: AuthServerApiListUserAccountsParamsFor
): Effect.Effect<
	Awaited<AuthServerApiListUserAccountsResultFor>,
	AccountAuthServerInputError | AccountAuthServerApiError | AccountAuthServerDataMissingError,
	AccountAuthServerService
> =>
	Effect.gen(function* (_) {
		// Get the schema from context
		const schema = yield* _(createListUserAccountsServerParamsSchema());

		// Validate input
		const parsed = schema.safeParse(input);

		if (!parsed.success) {
			yield* _(Effect.fail(new AccountAuthServerInputError('Invalid listUserAccounts input', parsed.error.issues)));
		}

		// Type guard validation
		if (!isAuthServerApiListUserAccountsParamsFor(parsed.data)) {
			yield* _(Effect.fail(new AccountAuthServerInputError('Input does not match expected listUserAccounts parameter structure')));
		}

		// Execute service with validated params
		const result = yield* _(listUserAccountsServerService(parsed.data));

		return result;
	}).pipe(Effect.provideServiceEffect(AccountAuthServerServiceTag, AccountAuthServerServiceTag));
