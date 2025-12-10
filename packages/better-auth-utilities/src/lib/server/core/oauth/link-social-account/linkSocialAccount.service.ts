/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/link-social-account/linkSocialAccount.service.ts
 * @description Server-side service for link social account operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import { APIError } from 'better-auth/api';
import type { AuthServerApiLinkSocialAccountParamsFor, linkSocialAccountPropsFor } from './linkSocialAccount.types';
import { OAuthAuthServerApiError } from '../shared/oauth.error';
import type { AuthServerFor } from '../../../server.types';
import { OAuthAuthServerServiceTag } from '../shared/oauth.service';

export const linkSocialAccountServerService: linkSocialAccountPropsFor = <T extends AuthServerFor = AuthServerFor>(
	params: AuthServerApiLinkSocialAccountParamsFor<T>
) =>
	Effect.flatMap(OAuthAuthServerServiceTag, ({ authServer }) =>
		Effect.tryPromise({
			try: () => authServer.api.linkSocialAccount(params),
			catch: (error) => {
				if (error instanceof APIError) {
					const status = typeof error.status === 'number' ? error.status : parseInt(error.status as string, 10) || undefined;
					return new OAuthAuthServerApiError(error.message, status, error);
				}
				const message = error instanceof Error ? error.message : 'Link social account failed';
				return new OAuthAuthServerApiError(message, undefined, error);
			},
		})
	);
