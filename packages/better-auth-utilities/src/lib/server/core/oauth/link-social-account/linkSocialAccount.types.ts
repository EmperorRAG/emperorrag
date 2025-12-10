/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/link-social-account/linkSocialAccount.types.ts
 * @description Type definitions for server-side link social account operation.
 */

import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from '../../../server.types';
import type { CoreAuthServerError } from '../../shared/core.error';
import type { OAuthAuthServerService } from '../shared/oauth.types';
import type * as Effect from 'effect/Effect';

export type AuthServerApiLinkSocialAccountPropsFor<T extends AuthServerFor = AuthServerFor> =
	'linkSocialAccount' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['linkSocialAccount'] : never;

export type AuthServerApiLinkSocialAccountParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<AuthServerApiLinkSocialAccountPropsFor<T>>[0];

export type AuthServerApiLinkSocialAccountResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<AuthServerApiLinkSocialAccountPropsFor<T>>;

export interface linkSocialAccountPropsFor<T extends AuthServerFor = AuthServerFor> {
	(
		params: AuthServerApiLinkSocialAccountParamsFor<T>
	): Effect.Effect<Awaited<AuthServerApiLinkSocialAccountResultFor<T>>, CoreAuthServerError, OAuthAuthServerService>;
}

export const isAuthServerApiLinkSocialAccountParamsFor = <T extends AuthServerFor = AuthServerFor>(
	value: unknown
): value is AuthServerApiLinkSocialAccountParamsFor<T> => {
	if (typeof value !== 'object' || value === null) return false;
	const obj = value as Record<string, unknown>;

	if (typeof obj.body !== 'object' || obj.body === null) return false;
	const body = obj.body as Record<string, unknown>;

	if (typeof body.provider !== 'string') return false;

	return true;
};
