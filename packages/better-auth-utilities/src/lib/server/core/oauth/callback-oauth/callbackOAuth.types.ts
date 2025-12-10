/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/callback-oauth/callbackOAuth.types.ts
 * @description Type definitions for server-side OAuth callback operation.
 */

import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from '../../../server.types';
import type { CoreAuthServerError } from '../../shared/core.error';
import type * as Effect from 'effect/Effect';

export type AuthServerApiCallbackOAuthPropsFor<T extends AuthServerFor = AuthServerFor> =
	'callbackOAuth' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['callbackOAuth'] : never;

export type AuthServerApiCallbackOAuthParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<AuthServerApiCallbackOAuthPropsFor<AuthServerFor>>[0];

export type AuthServerApiCallbackOAuthResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<AuthServerApiCallbackOAuthPropsFor<AuthServerFor>>;

export interface callbackOAuthPropsFor<T extends AuthServerFor = AuthServerFor> {
	(params: AuthServerApiCallbackOAuthParamsFor<AuthServerFor>): Effect.Effect<Awaited<AuthServerApiCallbackOAuthResultFor<AuthServerFor>>, CoreAuthServerError, AuthServerFor>;
}

export const isAuthServerApiCallbackOAuthParamsFor = (
	value: unknown
): value is AuthServerApiCallbackOAuthParamsFor<AuthServerFor> => {
	if (typeof value !== 'object' || value === null) return false;
	return true;
};
