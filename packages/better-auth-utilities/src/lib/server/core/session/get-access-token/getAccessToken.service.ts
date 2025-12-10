/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/get-access-token/getAccessToken.service.ts
 * @description Server-side service for get access token operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerApiGetAccessTokenParamsFor, getAccessTokenPropsFor } from './getAccessToken.types';
import { mapBetterAuthApiErrorToCoreAuthError } from '../../shared/core.error';
import type { AuthServerFor } from '../../../server.types';
import { AuthServerTag } from '../../../server.service';

export const getAccessTokenServerService: getAccessTokenPropsFor = (params: AuthServerApiGetAccessTokenParamsFor<AuthServerFor>) =>
	Effect.flatMap(AuthServerTag, (authServer) =>
		Effect.tryPromise({
			try: () => authServer.api.getAccessToken(params),
			catch: mapBetterAuthApiErrorToCoreAuthError,
		})
	);
