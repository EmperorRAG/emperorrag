/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/refresh-token/refreshToken.service.ts
 * @description Server-side service for refresh token operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerApiRefreshTokenParamsFor, refreshTokenPropsFor } from './refreshToken.types';
import { mapBetterAuthApiErrorToSessionAuthError } from '../shared/session.error';
import type { AuthServerFor } from '../../../server.types';
import { SessionAuthServerServiceTag } from '../shared/session.service';

export const refreshTokenServerService: refreshTokenPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiRefreshTokenParamsFor<T>) =>
	Effect.flatMap(SessionAuthServerServiceTag, ({ authServer }) =>
		Effect.tryPromise({
			try: () => authServer.api.refreshToken(params),
			catch: mapBetterAuthApiErrorToSessionAuthError,
		})
	);
