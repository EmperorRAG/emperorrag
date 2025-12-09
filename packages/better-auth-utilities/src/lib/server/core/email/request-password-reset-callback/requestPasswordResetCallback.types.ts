/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/request-password-reset-callback/requestPasswordResetCallback.types.ts
 * @description Type definitions for server-side request password reset callback operation.
 */

import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from '../../../server.types';
import type { EmailAuthServerError } from '../shared/email.error';
import type { EmailAuthServerService } from '../shared/email.types';
import type * as Effect from 'effect/Effect';

export type AuthServerApiRequestPasswordResetCallbackPropsFor<T extends AuthServerFor = AuthServerFor> =
	'requestPasswordResetCallback' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['requestPasswordResetCallback'] : never;

export type AuthServerApiRequestPasswordResetCallbackParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<
	AuthServerApiRequestPasswordResetCallbackPropsFor<T>
>[0];

export type AuthServerApiRequestPasswordResetCallbackResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<
	AuthServerApiRequestPasswordResetCallbackPropsFor<T>
>;

export interface requestPasswordResetCallbackPropsFor<T extends AuthServerFor = AuthServerFor> {
	(
		params: AuthServerApiRequestPasswordResetCallbackParamsFor<T>
	): Effect.Effect<Awaited<AuthServerApiRequestPasswordResetCallbackResultFor<T>>, EmailAuthServerError, EmailAuthServerService>;
}

export const isAuthServerApiRequestPasswordResetCallbackParamsFor = <T extends AuthServerFor = AuthServerFor>(
	value: unknown
): value is AuthServerApiRequestPasswordResetCallbackParamsFor<T> => {
	if (typeof value !== 'object' || value === null) return false;
	const obj = value as Record<string, unknown>;
	if (typeof obj['query'] !== 'object' || obj['query'] === null) return false;
	const query = obj['query'] as Record<string, unknown>;
	if (typeof query['token'] !== 'string' || query['token'].length === 0) return false;
	return true;
};
