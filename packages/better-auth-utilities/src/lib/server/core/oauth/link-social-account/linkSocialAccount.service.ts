/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/link-social-account/linkSocialAccount.service.ts
 * @description Server-side service for link social account operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerApiLinkSocialAccountParamsFor, linkSocialAccountPropsFor } from './linkSocialAccount.types';
import { mapBetterAuthApiErrorToOAuthAuthError } from '../shared/oauth.error';
import type { AuthServerFor } from '../../../server.types';
import { OAuthAuthServerServiceTag } from '../shared/oauth.service';

export const linkSocialAccountServerService: linkSocialAccountPropsFor = <T extends AuthServerFor = AuthServerFor>(
	params: AuthServerApiLinkSocialAccountParamsFor<T>
) =>
	Effect.flatMap(OAuthAuthServerServiceTag, ({ authServer }) =>
		Effect.tryPromise({
			try: () => authServer.api.linkSocialAccount(params),
			catch: mapBetterAuthApiErrorToOAuthAuthError,
		})
	);
