/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/link-social-account/linkSocialAccount.service.ts
 * @description Server-side service for link social account operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerApiLinkSocialAccountParamsFor, linkSocialAccountPropsFor } from './linkSocialAccount.types';
import { mapBetterAuthApiErrorToCoreAuthError } from '../../shared/core.error';
import type { AuthServerFor } from '../../../server.types';
import { AuthServerTag } from '../../../server.service';

export const linkSocialAccountServerService: linkSocialAccountPropsFor = (
	params: AuthServerApiLinkSocialAccountParamsFor<AuthServerFor>
) =>
	Effect.flatMap(AuthServerTag, (authServer) =>
		Effect.tryPromise({
			try: () => authServer.api.linkSocialAccount(params),
			catch: mapBetterAuthApiErrorToCoreAuthError,
		})
	);
