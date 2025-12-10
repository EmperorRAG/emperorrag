/**
 * @file libs/better-auth-utilities/src/lib/server/core/user/delete-user-callback/deleteUserCallback.types.ts
 * @description Type definitions for server-side delete user callback operation.
 */

import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from '../../../server.types';
import type { CoreAuthServerError } from '../../shared/core.error';
import type * as Effect from 'effect/Effect';

export type AuthServerApiDeleteUserCallbackPropsFor<T extends AuthServerFor = AuthServerFor> =
	'deleteUserCallback' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['deleteUserCallback'] : never;

export type AuthServerApiDeleteUserCallbackParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<AuthServerApiDeleteUserCallbackPropsFor<AuthServerFor>>[0];

export type AuthServerApiDeleteUserCallbackResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<AuthServerApiDeleteUserCallbackPropsFor<AuthServerFor>>;

export interface deleteUserCallbackPropsFor<T extends AuthServerFor = AuthServerFor> {
	(
		params: AuthServerApiDeleteUserCallbackParamsFor<AuthServerFor>
	): Effect.Effect<Awaited<AuthServerApiDeleteUserCallbackResultFor<AuthServerFor>>, CoreAuthServerError, AuthServerFor>;
}

export const isAuthServerApiDeleteUserCallbackParamsFor = (
	value: unknown
): value is AuthServerApiDeleteUserCallbackParamsFor<AuthServerFor> => {
	if (typeof value !== 'object' || value === null) return false;
	const obj = value as Record<string, unknown>;
	if (typeof obj['query'] !== 'object' || obj['query'] === null) return false;
	const query = obj['query'] as Record<string, unknown>;
	if (typeof query['token'] !== 'string' || query['token'].length === 0) return false;
	return true;
};
