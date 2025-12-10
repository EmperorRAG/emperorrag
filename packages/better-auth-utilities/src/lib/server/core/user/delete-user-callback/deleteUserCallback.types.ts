/**
 * @file libs/better-auth-utilities/src/lib/server/core/user/delete-user-callback/deleteUserCallback.types.ts
 * @description Type definitions for server-side delete user callback operation.
 */

import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from '../../../server.types';
import type { CoreAuthServerError } from '../../shared/core.error';
import type { UserAuthServerService } from '../shared/user.types';
import type * as Effect from 'effect/Effect';

export type AuthServerApiDeleteUserCallbackPropsFor<T extends AuthServerFor = AuthServerFor> =
	'deleteUserCallback' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['deleteUserCallback'] : never;

export type AuthServerApiDeleteUserCallbackParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<AuthServerApiDeleteUserCallbackPropsFor<T>>[0];

export type AuthServerApiDeleteUserCallbackResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<AuthServerApiDeleteUserCallbackPropsFor<T>>;

export interface deleteUserCallbackPropsFor<T extends AuthServerFor = AuthServerFor> {
	(
		params: AuthServerApiDeleteUserCallbackParamsFor<T>
	): Effect.Effect<Awaited<AuthServerApiDeleteUserCallbackResultFor<T>>, CoreAuthServerError, UserAuthServerService>;
}

export const isAuthServerApiDeleteUserCallbackParamsFor = <T extends AuthServerFor = AuthServerFor>(
	value: unknown
): value is AuthServerApiDeleteUserCallbackParamsFor<T> => {
	if (typeof value !== 'object' || value === null) return false;
	const obj = value as Record<string, unknown>;
	if (typeof obj['query'] !== 'object' || obj['query'] === null) return false;
	const query = obj['query'] as Record<string, unknown>;
	if (typeof query['token'] !== 'string' || query['token'].length === 0) return false;
	return true;
};
