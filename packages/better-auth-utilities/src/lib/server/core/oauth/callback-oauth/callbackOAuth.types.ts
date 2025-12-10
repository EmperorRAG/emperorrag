/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/callback-oauth/callbackOAuth.types.ts
 * @description Type definitions for server-side OAuth callback operation.
 */

import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from '../../../server.types';
import type { CoreAuthServerError } from '../../shared/core.error';
import type { OAuthAuthServerService } from '../shared/oauth.types';
import type * as Effect from 'effect/Effect';

export type AuthServerApiCallbackOAuthPropsFor<T extends AuthServerFor = AuthServerFor> =
	'callbackOAuth' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['callbackOAuth'] : never;

export type AuthServerApiCallbackOAuthParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<AuthServerApiCallbackOAuthPropsFor<T>>[0];

export type AuthServerApiCallbackOAuthResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<AuthServerApiCallbackOAuthPropsFor<T>>;

export interface callbackOAuthPropsFor<T extends AuthServerFor = AuthServerFor> {
	(
		params: AuthServerApiCallbackOAuthParamsFor<T>
	): Effect.Effect<Awaited<AuthServerApiCallbackOAuthResultFor<T>>, CoreAuthServerError, OAuthAuthServerService>;
}

export const isAuthServerApiCallbackOAuthParamsFor = <T extends AuthServerFor = AuthServerFor>(
	value: unknown
): value is AuthServerApiCallbackOAuthParamsFor<T> => {
	if (typeof value !== 'object' || value === null) return false;
	return true;
};
