/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/list-sessions/listSessions.types.ts
 * @description Type definitions for server-side list sessions operation.
 */

import type * as Effect from 'effect/Effect';
import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from '../../../server.types';
import type { AuthServerError } from '../../shared/core.error';

/**
 * Type helper to extract the listSessions endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `listSessions` method from the server API. This method
 * retrieves all active sessions for the authenticated user.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export type AuthServerApiListSessionsPropsFor<T extends AuthServerFor = AuthServerFor> =
	'listSessions' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['listSessions'] : never;

/**
 * Type helper to extract the input parameter type for auth.api.listSessions.
 *
 * @pure
 * @description Extracts the first parameter type from the listSessions method.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export type AuthServerApiListSessionsParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<AuthServerApiListSessionsPropsFor<AuthServerFor>>[0];

/**
 * Type helper to extract the return type from auth.api.listSessions.
 *
 * @pure
 * @description Extracts the Promise return type from the server API method.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export type AuthServerApiListSessionsResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<AuthServerApiListSessionsPropsFor<AuthServerFor>>;

/**
 * Function signature for listSessions server service.
 *
 * @pure
 * @description Function accepting input parameters, returning an Effect that requires AuthServerFor context.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export interface listSessionsPropsFor<T extends AuthServerFor = AuthServerFor> {
	(
		params: AuthServerApiListSessionsParamsFor<AuthServerFor>
	): Effect.Effect<Awaited<AuthServerApiListSessionsResultFor<AuthServerFor>>, AuthServerError, AuthServerFor>;
}

/**
 * Type guard for validating AuthServerApiListSessionsParamsFor.
 *
 * @pure
 * @description Narrows an unknown value to AuthServerApiListSessionsParamsFor<AuthServerFor> by checking
 * the required structural properties.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param value - The value to check
 * @returns True if value conforms to AuthServerApiListSessionsParamsFor<AuthServerFor> structure
 */
export const isAuthServerApiListSessionsParamsFor = (value: unknown): value is AuthServerApiListSessionsParamsFor<AuthServerFor> => {
	if (typeof value !== 'object' || value === null) return false;
	return true;
};
