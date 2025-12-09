/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/get-access-token/getAccessToken.types.ts
 * @description Type definitions for server-side get access token operation.
 */

import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from '../../../server.types';
import type { SessionAuthServerError } from '../shared/session.error';
import type { SessionAuthServerService } from '../shared/session.types';
import type * as Effect from 'effect/Effect';

export type AuthServerApiGetAccessTokenPropsFor<T extends AuthServerFor = AuthServerFor> =
	'getAccessToken' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['getAccessToken'] : never;

export type AuthServerApiGetAccessTokenParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<AuthServerApiGetAccessTokenPropsFor<T>>[0];

export type AuthServerApiGetAccessTokenResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<AuthServerApiGetAccessTokenPropsFor<T>>;

export interface getAccessTokenPropsFor<T extends AuthServerFor = AuthServerFor> {
	(
		params: AuthServerApiGetAccessTokenParamsFor<T>
	): Effect.Effect<Awaited<AuthServerApiGetAccessTokenResultFor<T>>, SessionAuthServerError, SessionAuthServerService>;
}

export const isAuthServerApiGetAccessTokenParamsFor = <T extends AuthServerFor = AuthServerFor>(
	value: unknown
): value is AuthServerApiGetAccessTokenParamsFor<T> => {
	if (typeof value !== 'object' || value === null) return false;
	return true;
};
