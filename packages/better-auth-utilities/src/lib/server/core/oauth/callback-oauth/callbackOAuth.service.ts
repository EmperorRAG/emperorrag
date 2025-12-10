/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/callback-oauth/callbackOAuth.service.ts
 * @description Server-side service for OAuth callback operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import { APIError } from 'better-auth/api';
import type { AuthServerApiCallbackOAuthParamsFor, callbackOAuthPropsFor } from './callbackOAuth.types';
import { OAuthAuthServerApiError } from '../shared/oauth.error';
import type { AuthServerFor } from '../../../server.types';
import { OAuthAuthServerServiceTag } from '../shared/oauth.service';

export const callbackOAuthServerService: callbackOAuthPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiCallbackOAuthParamsFor<T>) =>
	Effect.flatMap(OAuthAuthServerServiceTag, ({ authServer }) =>
		Effect.tryPromise({
			try: () => authServer.api.callbackOAuth(params),
			catch: (error) => {
				if (error instanceof APIError) {
					const status = typeof error.status === 'number' ? error.status : parseInt(error.status as string, 10) || undefined;
					return new OAuthAuthServerApiError(error.message, status, error);
				}
				const message = error instanceof Error ? error.message : 'OAuth callback failed';
				return new OAuthAuthServerApiError(message, undefined, error);
			},
		})
	);
