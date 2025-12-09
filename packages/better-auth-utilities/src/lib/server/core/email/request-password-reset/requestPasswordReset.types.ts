/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/request-password-reset/requestPasswordReset.types.ts
 * @description Type definitions for server-side request password reset operation.
 */

import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from '../../../server.types';
import type { EmailAuthServerError } from '../shared/email.error';
import type { EmailAuthServerService } from '../shared/email.types';
import type * as Effect from 'effect/Effect';

export type AuthServerApiRequestPasswordResetPropsFor<T extends AuthServerFor = AuthServerFor> =
	'requestPasswordReset' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['requestPasswordReset'] : never;

export type AuthServerApiRequestPasswordResetParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<AuthServerApiRequestPasswordResetPropsFor<T>>[0];

export type AuthServerApiRequestPasswordResetResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<AuthServerApiRequestPasswordResetPropsFor<T>>;

export interface requestPasswordResetPropsFor<T extends AuthServerFor = AuthServerFor> {
	(
		params: AuthServerApiRequestPasswordResetParamsFor<T>
	): Effect.Effect<Awaited<AuthServerApiRequestPasswordResetResultFor<T>>, EmailAuthServerError, EmailAuthServerService>;
}

export const isAuthServerApiRequestPasswordResetParamsFor = <T extends AuthServerFor = AuthServerFor>(
	value: unknown
): value is AuthServerApiRequestPasswordResetParamsFor<T> => {
	if (typeof value !== 'object' || value === null) return false;
	const obj = value as Record<string, unknown>;
	if (typeof obj['body'] !== 'object' || obj['body'] === null) return false;
	const body = obj['body'] as Record<string, unknown>;
	if (typeof body['email'] !== 'string' || body['email'].length === 0) return false;
	return true;
};
