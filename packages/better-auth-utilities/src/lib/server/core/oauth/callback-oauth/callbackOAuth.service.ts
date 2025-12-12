/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/callback-oauth/callbackOAuth.service.ts
 * @description Server-side service for OAuth callback operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import { mapApiError } from '../../../../errors/authServer.error';
import { AuthServerTag } from '../../../server.service';
import type { AuthServerFor } from '../../../server.types';
import type { AuthServerApiCallbackOAuthParamsFor, callbackOAuthPropsFor } from './callbackOAuth.types';

export const callbackOAuthServerService: callbackOAuthPropsFor = (params: AuthServerApiCallbackOAuthParamsFor<AuthServerFor>) =>
	Effect.flatMap(AuthServerTag, (authServer) =>
		Effect.tryPromise({
			try: () => authServer.api.callbackOAuth(params),
			catch: mapApiError,
		})
	);
