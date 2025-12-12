/**
 * @file libs/better-auth-utilities/src/lib/server/core/user/delete-user/deleteUser.types.ts
 * @description Type definitions for server-side delete user operation.
 */

import type * as Effect from 'effect/Effect';
import type { AuthServerError } from '../../../../errors/authServer.error';
import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from '../../../server.types';

/**
 * Type helper to extract the deleteUser endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `deleteUser` method from the server API. This method
 * allows users to delete their account.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export type AuthServerApiDeleteUserPropsFor<T extends AuthServerFor = AuthServerFor> =
	'deleteUser' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['deleteUser'] : never;

/**
 * Type helper to extract the input parameter type for auth.api.deleteUser.
 *
 * @pure
 * @description Extracts the first parameter type from the deleteUser method.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export type AuthServerApiDeleteUserParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<AuthServerApiDeleteUserPropsFor<AuthServerFor>>[0];

/**
 * Type helper to extract the return type from auth.api.deleteUser.
 *
 * @pure
 * @description Extracts the Promise return type from the server API method.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export type AuthServerApiDeleteUserResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<AuthServerApiDeleteUserPropsFor<AuthServerFor>>;

/**
 * Function signature for deleteUser server service.
 *
 * @pure
 * @description Function accepting input parameters, returning an Effect that requires AuthServerFor context.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export interface deleteUserPropsFor<T extends AuthServerFor = AuthServerFor> {
	(
		params: AuthServerApiDeleteUserParamsFor<AuthServerFor>
	): Effect.Effect<Awaited<AuthServerApiDeleteUserResultFor<AuthServerFor>>, AuthServerError, AuthServerFor>;
}

/**
 * Type guard for validating AuthServerApiDeleteUserParamsFor.
 *
 * @pure
 * @description Narrows an unknown value to AuthServerApiDeleteUserParamsFor<AuthServerFor> by checking
 * the required structural properties.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param value - The value to check
 * @returns True if value conforms to AuthServerApiDeleteUserParamsFor<AuthServerFor> structure
 */
export const isAuthServerApiDeleteUserParamsFor = (value: unknown): value is AuthServerApiDeleteUserParamsFor<AuthServerFor> => {
	if (typeof value !== 'object' || value === null) return false;
	const obj = value as Record<string, unknown>;

	// deleteUser may have optional body with password or callbackURL
	if (obj.body !== undefined && typeof obj.body !== 'object') return false;

	return true;
};
