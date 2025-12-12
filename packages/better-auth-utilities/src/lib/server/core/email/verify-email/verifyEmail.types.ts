/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/verify-email/verifyEmail.types.ts
 * @description Type definitions for server-side verify email operation.
 */

import type * as Effect from 'effect/Effect';
import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from '../../../server.types';
import type { AuthServerError } from '../../shared/core.error';

/**
 * Type helper to extract the verifyEmail endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `verifyEmail` method from the server API. This method
 * verifies a user's email address using the verification token from their email.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export type AuthServerApiVerifyEmailPropsFor<T extends AuthServerFor = AuthServerFor> =
	'verifyEmail' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['verifyEmail'] : never;

/**
 * Type helper to extract the input parameter type for auth.api.verifyEmail.
 *
 * @pure
 * @description Extracts the first parameter type from the verifyEmail method.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export type AuthServerApiVerifyEmailParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<AuthServerApiVerifyEmailPropsFor<AuthServerFor>>[0];

/**
 * Type helper to extract the return type from auth.api.verifyEmail.
 *
 * @pure
 * @description Extracts the Promise return type from the server API method.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export type AuthServerApiVerifyEmailResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<AuthServerApiVerifyEmailPropsFor<AuthServerFor>>;

/**
 * Function signature for verifyEmail server service.
 *
 * @pure
 * @description Function accepting input parameters, returning an Effect that requires AuthServerFor context.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export interface verifyEmailPropsFor<T extends AuthServerFor = AuthServerFor> {
	(
		params: AuthServerApiVerifyEmailParamsFor<AuthServerFor>
	): Effect.Effect<Awaited<AuthServerApiVerifyEmailResultFor<AuthServerFor>>, AuthServerError, AuthServerFor>;
}

/**
 * Type guard for validating AuthServerApiVerifyEmailParamsFor.
 *
 * @pure
 * @description Narrows an unknown value to AuthServerApiVerifyEmailParamsFor<AuthServerFor> by checking
 * the required structural properties.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param value - The value to check
 * @returns True if value conforms to AuthServerApiVerifyEmailParamsFor<AuthServerFor> structure
 */
export const isAuthServerApiVerifyEmailParamsFor = (value: unknown): value is AuthServerApiVerifyEmailParamsFor<AuthServerFor> => {
	if (typeof value !== 'object' || value === null) return false;
	const obj = value as Record<string, unknown>;

	if (typeof obj.query !== 'object' || obj.query === null) return false;
	const query = obj.query as Record<string, unknown>;

	if (typeof query.token !== 'string') return false;

	return true;
};
