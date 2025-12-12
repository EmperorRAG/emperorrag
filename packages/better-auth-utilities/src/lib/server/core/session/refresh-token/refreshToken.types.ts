/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/refresh-token/refreshToken.types.ts
 * @description Type definitions for server-side refresh token operation.
 */

import type * as Effect from 'effect/Effect';
import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from '../../../server.types';
import type { AuthServerError } from '../../shared/core.error';

export type AuthServerApiRefreshTokenPropsFor<T extends AuthServerFor = AuthServerFor> =
	'refreshToken' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['refreshToken'] : never;

export type AuthServerApiRefreshTokenParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<AuthServerApiRefreshTokenPropsFor<AuthServerFor>>[0];

export type AuthServerApiRefreshTokenResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<AuthServerApiRefreshTokenPropsFor<AuthServerFor>>;

export interface refreshTokenPropsFor<T extends AuthServerFor = AuthServerFor> {
	(
		params: AuthServerApiRefreshTokenParamsFor<AuthServerFor>
	): Effect.Effect<Awaited<AuthServerApiRefreshTokenResultFor<AuthServerFor>>, AuthServerError, AuthServerFor>;
}

export const isAuthServerApiRefreshTokenParamsFor = (value: unknown): value is AuthServerApiRefreshTokenParamsFor<AuthServerFor> => {
	if (typeof value !== 'object' || value === null) return false;
	return true;
};
