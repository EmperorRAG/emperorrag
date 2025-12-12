/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/link-social-account/linkSocialAccount.types.ts
 * @description Type definitions for server-side link social account operation.
 */

import type * as Effect from 'effect/Effect';
import type { AuthServerError } from '../../../../errors/authServer.error';
import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from '../../../server.types';

export type AuthServerApiLinkSocialAccountPropsFor<T extends AuthServerFor = AuthServerFor> =
	'linkSocialAccount' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['linkSocialAccount'] : never;

export type AuthServerApiLinkSocialAccountParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<
	AuthServerApiLinkSocialAccountPropsFor<AuthServerFor>
>[0];

export type AuthServerApiLinkSocialAccountResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<
	AuthServerApiLinkSocialAccountPropsFor<AuthServerFor>
>;

export interface linkSocialAccountPropsFor<T extends AuthServerFor = AuthServerFor> {
	(
		params: AuthServerApiLinkSocialAccountParamsFor<AuthServerFor>
	): Effect.Effect<Awaited<AuthServerApiLinkSocialAccountResultFor<AuthServerFor>>, AuthServerError, AuthServerFor>;
}

export const isAuthServerApiLinkSocialAccountParamsFor = (value: unknown): value is AuthServerApiLinkSocialAccountParamsFor<AuthServerFor> => {
	if (typeof value !== 'object' || value === null) return false;
	const obj = value as Record<string, unknown>;

	if (typeof obj.body !== 'object' || obj.body === null) return false;
	const body = obj.body as Record<string, unknown>;

	if (typeof body.provider !== 'string') return false;

	return true;
};
