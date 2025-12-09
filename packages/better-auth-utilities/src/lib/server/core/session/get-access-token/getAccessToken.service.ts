/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/get-access-token/getAccessToken.service.ts
 * @description Server-side service for get access token operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import { APIError } from 'better-auth/api';
import type { AuthServerApiGetAccessTokenParamsFor, getAccessTokenPropsFor } from './getAccessToken.types';
import { SessionAuthServerApiError } from '../shared/session.error';
import type { AuthServerFor } from '../../../server.types';
import { SessionAuthServerServiceTag } from '../shared/session.service';

export const getAccessTokenServerService: getAccessTokenPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiGetAccessTokenParamsFor<T>) =>
	Effect.flatMap(SessionAuthServerServiceTag, ({ authServer }) =>
		Effect.tryPromise({
			try: () => authServer.api.getAccessToken(params),
			catch: (error) => {
				if (error instanceof APIError) {
					const status = typeof error.status === 'number' ? error.status : parseInt(error.status as string, 10) || undefined;
					return new SessionAuthServerApiError(error.message, status, error);
				}
				const message = error instanceof Error ? error.message : 'Get access token failed';
				return new SessionAuthServerApiError(message, undefined, error);
			},
		})
	);
