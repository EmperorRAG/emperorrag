/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/get-session/getSession.types.ts
 * @description Type definitions for server-side get session operation.
 */

import type { Effect } from 'effect';
import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from '../../../server.types';
import type { CoreAuthServerApiError, CoreAuthServerInputError } from '../../shared/core.error';
import type { SessionAuthServerService } from '../shared/session.types';

/**
 * Type helper to extract the getSession endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `getSession` method from the server API. This method
 * retrieves the current user's session and user data based on the provided headers/cookies.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type GetSessionMethod = AuthServerApiGetSessionPropsFor<typeof authServer>;
 * // (args: { headers: Headers, ... }) => Promise<{ user: User, session: Session } | null>
 *
 * const getSession: AuthServerApiGetSessionPropsFor = authServer.api.getSession;
 * const result = await getSession({
 *   headers: request.headers
 * });
 * ```
 */
export type AuthServerApiGetSessionPropsFor<T extends AuthServerFor = AuthServerFor> =
	'getSession' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['getSession'] : never;

/**
 * Type helper to extract the input parameter type for auth.api.getSession.
 *
 * @pure
 * @description Extracts the first parameter type from the getSession method.
 * Includes headers (required for cookie-based session lookup) and optional request options.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Input = AuthServerApiGetSessionParamsFor<typeof authServer>;
 * // { headers: Headers, asResponse?: boolean, ... }
 * ```
 */
export type AuthServerApiGetSessionParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<AuthServerApiGetSessionPropsFor<T>>[0];

/**
 * Type helper to extract the return type from auth.api.getSession.
 *
 * @pure
 * @description Extracts the Promise return type from the server API method.
 * The Promise resolves to session/user data or null if no valid session exists.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Result = AuthServerApiGetSessionResultFor<typeof authServer>;
 * // Promise<{ user: User, session: Session } | null>
 * ```
 */
export type AuthServerApiGetSessionResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<AuthServerApiGetSessionPropsFor<T>>;

/**
 * Function signature for getSession server service.
 *
 * @pure
 * @description Function accepting input parameters, returning an Effect that requires SessionAuthServerService context.
 * Dependencies are accessed through Effect's context layer rather than curried function arguments.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @remarks
 * **Context-Based Dependency Injection:**
 * - Dependencies (authServer) are provided via Effect's context layer (SessionAuthServerService)
 * - Function accepts only the API parameters directly
 * - Effect executes lazily when run with provided context
 *
 * **Error Channel:**
 * - CoreAuthServerApiError: API call failures with HTTP status codes
 * - CoreAuthServerInputError: Validation failures from controller layer
 *
 * @example
 * ```typescript
 * import { Effect } from 'effect';
 * import { getSessionServerService } from './getSession.service';
 * import { SessionAuthServerServiceTag } from '../shared/session.service';
 *
 * const program = getSessionServerService({
 *   headers: request.headers
 * });
 *
 * // Provide context and run
 * const result = await Effect.runPromise(
 *   Effect.provideService(program, SessionAuthServerServiceTag, { authServer })
 * );
 *
 * if (result) {
 *   console.log('User:', result.user.email);
 * } else {
 *   console.log('No active session');
 * }
 * ```
 */
export type getSessionPropsFor<T extends AuthServerFor = AuthServerFor> = (
	params: AuthServerApiGetSessionParamsFor<T>
) => Effect.Effect<Awaited<AuthServerApiGetSessionResultFor<T>>, CoreAuthServerApiError | CoreAuthServerInputError, AuthServerFor>;

/**
 * Type guard for validating AuthServerApiGetSessionParamsFor.
 *
 * @pure
 * @description Narrows an unknown value to AuthServerApiGetSessionParamsFor<T> by checking
 * the required structural properties. Use after Zod validation to provide type narrowing
 * without casting.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param value - The value to check
 * @returns True if value conforms to AuthServerApiGetSessionParamsFor<T> structure
 *
 * @example
 * ```typescript
 * const params: unknown = getParamsFromRequest(request);
 *
 * if (isAuthServerApiGetSessionParamsFor(params)) {
 *   // params is now narrowed to AuthServerApiGetSessionParamsFor
 *   await service(params);
 * } else {
 *   throw new Error('Invalid params structure');
 * }
 * ```
 */
export const isAuthServerApiGetSessionParamsFor = <T extends AuthServerFor = AuthServerFor>(value: unknown): value is AuthServerApiGetSessionParamsFor<T> => {
	if (typeof value !== 'object' || value === null) {
		return false;
	}

	const candidate = value as Record<string, unknown>;

	// getSession requires headers for cookie-based session lookup
	if (!('headers' in candidate) || !(candidate['headers'] instanceof Headers)) {
		return false;
	}

	return true;
};
