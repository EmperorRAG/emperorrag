/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/list-user-accounts/listUserAccounts.service.ts
 * @description Server-side service for handling listUserAccounts operations using Effect-TS.
 * Uses Context-based dependency injection to access the Better Auth server.
 */

import { Effect } from 'effect';
import { AccountAuthServerDataMissingError, mapBetterAuthApiErrorToAccountAuthError } from '../shared/account.error';
import { AccountAuthServerServiceTag } from '../shared/account.service';
import type { AuthServerApiListUserAccountsParamsFor, listUserAccountsPropsFor } from './listUserAccounts.types';

/**
 * Server-side service for listing user's linked accounts.
 *
 * @pure
 * @description Creates an Effect that lists all linked accounts (OAuth providers, credentials)
 * for the authenticated user. Uses Effect's Context layer to access the authServer dependency.
 * Returns an Effect requiring AccountAuthServerService context that, when provided, fetches the accounts list.
 *
 * @param params - The listUserAccounts parameters including headers for session
 * @returns Effect requiring AccountAuthServerService context, failing with AccountAuthServerApiError
 *          or AccountAuthServerDataMissingError, and succeeding with the accounts list
 *
 * @example
 * ```typescript
 * import { Effect } from 'effect';
 * import { AccountAuthServerServiceTag } from '../shared/account.service';
 * import { listUserAccountsServerService } from './listUserAccounts.service';
 *
 * // Create the service with request headers
 * const program = listUserAccountsServerService({
 *   headers: request.headers
 * });
 *
 * // Provide the AuthServer dependency via Context
 * const result = await Effect.runPromise(
 *   Effect.provideService(program, AccountAuthServerServiceTag, { authServer })
 * );
 *
 * // result is Account[]
 * console.log(result.length, 'linked accounts');
 * ```
 *
 * @example
 * ```typescript
 * // Using with Effect.gen for composition
 * const program = Effect.gen(function* (_) {
 *   const accounts = yield* _(listUserAccountsServerService({
 *     headers: request.headers
 *   }));
 *
 *   // Filter by provider
 *   const googleAccounts = accounts.filter(a => a.providerId === 'google');
 *   return googleAccounts;
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Error handling
 * const program = Effect.gen(function* (_) {
 *   const accounts = yield* _(
 *     listUserAccountsServerService({ headers: request.headers }).pipe(
 *       Effect.catchTag('AccountAuthServerApiError', (e) =>
 *         Effect.fail(new Error('Failed to fetch accounts'))
 *       )
 *     )
 *   );
 *   return accounts;
 * });
 * ```
 */
export const listUserAccountsServerService: listUserAccountsPropsFor = (params: AuthServerApiListUserAccountsParamsFor) =>
	Effect.flatMap(AccountAuthServerServiceTag, ({ authServer }) =>
		Effect.gen(function* (_) {
			const result = yield* _(
				Effect.tryPromise({
					try: () => authServer.api.listUserAccounts(params),
					catch: mapBetterAuthApiErrorToAccountAuthError,
				})
			);

			if (result === null || result === undefined) {
				yield* _(Effect.fail(new AccountAuthServerDataMissingError('No accounts data returned from listUserAccounts API')));
			}

			return result;
		})
	);
