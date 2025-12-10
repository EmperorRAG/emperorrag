/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/list-user-accounts/listUserAccounts.service.ts
 * @description Server-side service for handling listUserAccounts operations using Effect-TS.
 * Uses Context-based dependency injection to access the Better Auth server.
 */

import * as Effect from 'effect/Effect';
import { CoreAuthServerDataMissingError, mapBetterAuthApiErrorToCoreAuthError } from '../../shared/core.error';
import { AuthServerTag } from '../../../server.service';
import type { AuthServerFor } from '../../../server.types';
import type { AuthServerApiListUserAccountsParamsFor, listUserAccountsPropsFor } from './listUserAccounts.types';

/**
 * Server-side service for listing user's linked accounts.
 *
 * @pure
 * @description Creates an Effect that lists all linked accounts (OAuth providers, credentials)
 * for the authenticated user. Uses Effect's Context layer to access the authServer dependency.
 * Returns an Effect requiring AuthServerFor context that, when provided, fetches the accounts list.
 *
 * @param params - The listUserAccounts parameters including headers for session
 * @returns Effect requiring AuthServerFor context, failing with CoreAuthServerApiError
 *          or CoreAuthServerDataMissingError, and succeeding with the accounts list
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { AuthServerTag } from '../../../server.service';
 * import { listUserAccountsServerService } from './listUserAccounts.service';
 *
 * // Create the service with request headers
 * const program = listUserAccountsServerService({
 *   headers: request.headers
 * });
 *
 * // Provide the AuthServer dependency via Context
 * const result = await Effect.runPromise(
 *   Effect.provideService(program, AuthServerTag, authServer)
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
```
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
 *       Effect.catchTag('CoreAuthServerApiError', (e) =>
 *         Effect.fail(new Error('Failed to fetch accounts'))
 *       )
 *     )
 *   );
 *   return accounts;
 * });
 * ```
 */
export const listUserAccountsServerService: listUserAccountsPropsFor = (params: AuthServerApiListUserAccountsParamsFor<AuthServerFor>) =>
	Effect.flatMap(AuthServerTag, (authServer) =>
		Effect.gen(function* (_) {
			const result = yield* _(
				Effect.tryPromise({
					try: () => authServer.api.listUserAccounts(params),
					catch: mapBetterAuthApiErrorToCoreAuthError,
				})
			);

			if (result === null || result === undefined) {
				yield* _(Effect.fail(new CoreAuthServerDataMissingError('No accounts data returned from listUserAccounts API')));
			}

			return result;
		})
	);
