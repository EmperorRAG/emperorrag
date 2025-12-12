/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/list-user-accounts/listUserAccounts.types.ts
 * @description Type definitions for the listUserAccounts server authentication operation.
 * Provides comprehensive type safety for listing user's linked accounts (OAuth providers, credentials).
 */

import type * as Effect from 'effect/Effect';
import type { AuthServerApiError, AuthServerDataMissingError, AuthServerInputError } from '../../../../errors/authServer.error';
import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from '../../../server.types';

/**
 * Type helper to extract the listUserAccounts endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `listUserAccounts` method from the server API. This method
 * retrieves all linked accounts (OAuth providers, credentials) for the authenticated user.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type ListUserAccountsMethod = AuthServerApiListUserAccountsPropsFor<typeof authServer>;
 * // Inferred as the full method type for api.listUserAccounts
 *
 * const listUserAccounts: AuthServerApiListUserAccountsPropsFor = authServer.api.listUserAccounts;
 * const result = await listUserAccounts({
 *   headers: request.headers
 * });
 * ```
 */
export type AuthServerApiListUserAccountsPropsFor<T extends AuthServerFor = AuthServerFor> =
	'listUserAccounts' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['listUserAccounts'] : never;

/**
 * Type helper to extract the input parameter type for auth.api.listUserAccounts.
 *
 * @pure
 * @description Extracts the first parameter type from the listUserAccounts method.
 * Includes headers (required for session) and optional request options.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Input = AuthServerApiListUserAccountsParamsFor<typeof authServer>;
 * // { headers: Headers, asResponse?: boolean, ... }
 * ```
 */
export type AuthServerApiListUserAccountsParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<
	AuthServerApiListUserAccountsPropsFor<AuthServerFor>
>[0];

/**
 * Type helper to extract the return type from auth.api.listUserAccounts.
 *
 * @pure
 * @description Extracts the Promise return type from the server API method.
 * The Promise resolves to an array of linked accounts with provider information.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Result = AuthServerApiListUserAccountsResultFor<typeof authServer>;
 * // Promise<Account[]>
 * ```
 */
export type AuthServerApiListUserAccountsResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<AuthServerApiListUserAccountsPropsFor<AuthServerFor>>;

/**
 * Function signature for listUserAccounts server service.
 *
 * @pure
 * @description Function accepting input parameters, returning an Effect that requires AuthServerFor context.
 * Dependencies are accessed through Effect's context layer rather than curried function arguments.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * const service: listUserAccountsPropsFor = (params) =>
 *   Effect.flatMap(AuthServerTag, (authServer) =>
 *     Effect.tryPromise({
 *       try: () => authServer.api.listUserAccounts(params),
 *       catch: (error) => {
 *         const message = error instanceof Error ? error.message : 'Failed to list accounts';
 *         return new AuthServerApiError(message, undefined, error);
 *       }
 *     })
 *   );
 * ```
 */
export type listUserAccountsPropsFor<T extends AuthServerFor = AuthServerFor> = (
	params: AuthServerApiListUserAccountsParamsFor<AuthServerFor>
) => Effect.Effect<
	Awaited<AuthServerApiListUserAccountsResultFor<AuthServerFor>>,
	AuthServerApiError | AuthServerInputError | AuthServerDataMissingError,
	AuthServerFor
>;

/**
 * Type guard to check if an unknown value is a valid listUserAccounts params object.
 *
 * @pure
 * @description Validates that the value has the required structure for listUserAccounts API parameters.
 * Specifically checks for the presence of a headers property which is required for session validation.
 *
 * @param value - The value to check
 * @returns True if the value is a valid listUserAccounts params object
 *
 * @example
 * ```typescript
 * const params: unknown = getParamsFromRequest(request);
 *
 * if (isAuthServerApiListUserAccountsParamsFor(params)) {
 *   // params is now narrowed to AuthServerApiListUserAccountsParamsFor
 *   await service(params);
 * } else {
 *   throw new Error('Invalid params structure');
 * }
 * ```
 */
export const isAuthServerApiListUserAccountsParamsFor = (value: unknown): value is AuthServerApiListUserAccountsParamsFor<AuthServerFor> => {
	if (typeof value !== 'object' || value === null) {
		return false;
	}

	const candidate = value as Record<string, unknown>;

	// listUserAccounts requires headers for session authentication
	if (!('headers' in candidate) || !(candidate['headers'] instanceof Headers)) {
		return false;
	}

	return true;
};
