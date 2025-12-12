/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/request-password-reset-callback/requestPasswordResetCallback.types.ts
 * @description Type definitions for server-side request password reset callback operation.
 */

import type * as Effect from 'effect/Effect';
import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from '../../../server.types';
import type { AuthServerError } from '../../shared/core.error';

export type AuthServerApiRequestPasswordResetCallbackPropsFor<T extends AuthServerFor = AuthServerFor> =
	'requestPasswordResetCallback' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['requestPasswordResetCallback'] : never;

export type AuthServerApiRequestPasswordResetCallbackParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<
	AuthServerApiRequestPasswordResetCallbackPropsFor<AuthServerFor>
>[0];

export type AuthServerApiRequestPasswordResetCallbackResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<
	AuthServerApiRequestPasswordResetCallbackPropsFor<AuthServerFor>
>;

export interface requestPasswordResetCallbackPropsFor<T extends AuthServerFor = AuthServerFor> {
	(
		params: AuthServerApiRequestPasswordResetCallbackParamsFor<AuthServerFor>
	): Effect.Effect<Awaited<AuthServerApiRequestPasswordResetCallbackResultFor<AuthServerFor>>, AuthServerError, AuthServerFor>;
}

export const isAuthServerApiRequestPasswordResetCallbackParamsFor = (
	value: unknown
): value is AuthServerApiRequestPasswordResetCallbackParamsFor<AuthServerFor> => {
	if (typeof value !== 'object' || value === null) return false;
	const obj = value as Record<string, unknown>;
	if (typeof obj['query'] !== 'object' || obj['query'] === null) return false;
	const query = obj['query'] as Record<string, unknown>;
	if (typeof query['token'] !== 'string' || query['token'].length === 0) return false;
	return true;
};
