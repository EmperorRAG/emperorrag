/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/refresh-token/refreshToken.service.ts
 * @description Server-side service for refresh token operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import { APIError } from 'better-auth/api';
import type { AuthServerApiRefreshTokenParamsFor, refreshTokenPropsFor } from './refreshToken.types';
import { SessionAuthServerApiError } from '../shared/session.error';
import type { AuthServerFor } from '../../../server.types';
import { SessionAuthServerServiceTag } from '../shared/session.service';

export const refreshTokenServerService: refreshTokenPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiRefreshTokenParamsFor<T>) =>
	Effect.flatMap(SessionAuthServerServiceTag, ({ authServer }) =>
		Effect.tryPromise({
			try: () => authServer.api.refreshToken(params),
			catch: (error) => {
				if (error instanceof APIError) {
					const status = typeof error.status === 'number' ? error.status : parseInt(error.status as string, 10) || undefined;
					return new SessionAuthServerApiError(error.message, status, error);
				}
				const message = error instanceof Error ? error.message : 'Refresh token failed';
				return new SessionAuthServerApiError(message, undefined, error);
			},
		})
	);
