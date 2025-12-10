/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/callback-oauth/callbackOAuth.service.ts
 * @description Server-side service for OAuth callback operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerApiCallbackOAuthParamsFor, callbackOAuthPropsFor } from './callbackOAuth.types';
import { mapBetterAuthApiErrorToCoreAuthError } from '../../shared/core.error';
import type { AuthServerFor } from '../../../server.types';
import { OAuthAuthServerServiceTag } from '../shared/oauth.service';

export const callbackOAuthServerService: callbackOAuthPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiCallbackOAuthParamsFor<T>) =>
	Effect.flatMap(OAuthAuthServerServiceTag, ({ authServer }) =>
		Effect.tryPromise({
			try: () => authServer.api.callbackOAuth(params),
			catch: mapBetterAuthApiErrorToCoreAuthError,
		})
	);
