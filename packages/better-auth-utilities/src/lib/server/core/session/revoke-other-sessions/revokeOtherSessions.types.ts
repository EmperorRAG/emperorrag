/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-other-sessions/revokeOtherSessions.types.ts
 * @description Type definitions for server-side revoke other sessions operation.
 */

import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from '../../../server.types';
import type { CoreAuthServerError } from '../../shared/core.error';
import type * as Effect from 'effect/Effect';

export type AuthServerApiRevokeOtherSessionsPropsFor<T extends AuthServerFor = AuthServerFor> =
	'revokeOtherSessions' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['revokeOtherSessions'] : never;

export type AuthServerApiRevokeOtherSessionsParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<AuthServerApiRevokeOtherSessionsPropsFor<AuthServerFor>>[0];

export type AuthServerApiRevokeOtherSessionsResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<AuthServerApiRevokeOtherSessionsPropsFor<AuthServerFor>>;

export interface revokeOtherSessionsPropsFor<T extends AuthServerFor = AuthServerFor> {
	(
		params: AuthServerApiRevokeOtherSessionsParamsFor<AuthServerFor>
	): Effect.Effect<Awaited<AuthServerApiRevokeOtherSessionsResultFor<AuthServerFor>>, CoreAuthServerError, AuthServerFor>;
}

export const isAuthServerApiRevokeOtherSessionsParamsFor = (
	value: unknown
): value is AuthServerApiRevokeOtherSessionsParamsFor<AuthServerFor> => {
	if (typeof value !== 'object' || value === null) return false;
	return true;
};
