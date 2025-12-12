/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-sessions/revokeSessions.types.ts
 * @description Type definitions for server-side revoke all sessions operation.
 */

import type * as Effect from 'effect/Effect';
import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from '../../../server.types';
import type { AuthServerError } from '../../shared/core.error';

export type AuthServerApiRevokeSessionsPropsFor<T extends AuthServerFor = AuthServerFor> =
	'revokeSessions' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['revokeSessions'] : never;

export type AuthServerApiRevokeSessionsParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<AuthServerApiRevokeSessionsPropsFor<AuthServerFor>>[0];

export type AuthServerApiRevokeSessionsResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<AuthServerApiRevokeSessionsPropsFor<AuthServerFor>>;

export interface revokeSessionsPropsFor<T extends AuthServerFor = AuthServerFor> {
	(
		params: AuthServerApiRevokeSessionsParamsFor<AuthServerFor>
	): Effect.Effect<Awaited<AuthServerApiRevokeSessionsResultFor<AuthServerFor>>, AuthServerError, AuthServerFor>;
}

export const isAuthServerApiRevokeSessionsParamsFor = (value: unknown): value is AuthServerApiRevokeSessionsParamsFor<AuthServerFor> => {
	if (typeof value !== 'object' || value === null) return false;
	return true;
};
