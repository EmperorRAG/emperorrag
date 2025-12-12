/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/request-password-reset/requestPasswordReset.types.ts
 * @description Type definitions for server-side request password reset operation.
 */

import type * as Effect from 'effect/Effect';
import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from '../../../server.types';
import type { AuthServerError } from '../../shared/core.error';

export type AuthServerApiRequestPasswordResetPropsFor<T extends AuthServerFor = AuthServerFor> =
	'requestPasswordReset' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['requestPasswordReset'] : never;

export type AuthServerApiRequestPasswordResetParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<
	AuthServerApiRequestPasswordResetPropsFor<AuthServerFor>
>[0];

export type AuthServerApiRequestPasswordResetResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<
	AuthServerApiRequestPasswordResetPropsFor<AuthServerFor>
>;

export interface requestPasswordResetPropsFor<T extends AuthServerFor = AuthServerFor> {
	(
		params: AuthServerApiRequestPasswordResetParamsFor<AuthServerFor>
	): Effect.Effect<Awaited<AuthServerApiRequestPasswordResetResultFor<AuthServerFor>>, AuthServerError, AuthServerFor>;
}

export const isAuthServerApiRequestPasswordResetParamsFor = (value: unknown): value is AuthServerApiRequestPasswordResetParamsFor<AuthServerFor> => {
	if (typeof value !== 'object' || value === null) return false;
	const obj = value as Record<string, unknown>;
	if (typeof obj['body'] !== 'object' || obj['body'] === null) return false;
	const body = obj['body'] as Record<string, unknown>;
	if (typeof body['email'] !== 'string' || body['email'].length === 0) return false;
	return true;
};
