/**
 * @file libs/better-auth-utilities/src/lib/server/core/user/delete-user/deleteUser.types.ts
 * @description Type definitions for server-side delete user operation.
 */

import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from '../../../server.types';
import type { UserAuthServerError } from '../shared/user.error';
import type { UserAuthServerService } from '../shared/user.types';
import type * as Effect from 'effect/Effect';

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
export type AuthServerApiDeleteUserParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<AuthServerApiDeleteUserPropsFor<T>>[0];

/**
 * Type helper to extract the return type from auth.api.deleteUser.
 *
 * @pure
 * @description Extracts the Promise return type from the server API method.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export type AuthServerApiDeleteUserResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<AuthServerApiDeleteUserPropsFor<T>>;

/**
 * Function signature for deleteUser server service.
 *
 * @pure
 * @description Function accepting input parameters, returning an Effect that requires UserAuthServerService context.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export interface deleteUserPropsFor<T extends AuthServerFor = AuthServerFor> {
	(params: AuthServerApiDeleteUserParamsFor<T>): Effect.Effect<Awaited<AuthServerApiDeleteUserResultFor<T>>, UserAuthServerError, UserAuthServerService>;
}

/**
 * Type guard for validating AuthServerApiDeleteUserParamsFor.
 *
 * @pure
 * @description Narrows an unknown value to AuthServerApiDeleteUserParamsFor<T> by checking
 * the required structural properties.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param value - The value to check
 * @returns True if value conforms to AuthServerApiDeleteUserParamsFor<T> structure
 */
export const isAuthServerApiDeleteUserParamsFor = <T extends AuthServerFor = AuthServerFor>(value: unknown): value is AuthServerApiDeleteUserParamsFor<T> => {
	if (typeof value !== 'object' || value === null) return false;
	const obj = value as Record<string, unknown>;

	// deleteUser may have optional body with password or callbackURL
	if (obj.body !== undefined && typeof obj.body !== 'object') return false;

	return true;
};
