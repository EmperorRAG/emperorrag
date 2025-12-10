/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/refresh-token/refreshToken.service.ts
 * @description Server-side service for refresh token operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerApiRefreshTokenParamsFor, refreshTokenPropsFor } from './refreshToken.types';
import { mapBetterAuthApiErrorToCoreAuthError } from '../../shared/core.error';
import type { AuthServerFor } from '../../../server.types';
import { AuthServerTag } from '../../../server.service';

export const refreshTokenServerService: refreshTokenPropsFor = (params: AuthServerApiRefreshTokenParamsFor<AuthServerFor>) =>
	Effect.flatMap(AuthServerTag, (authServer) =>
		Effect.tryPromise({
			try: () => authServer.api.refreshToken(params),
			catch: mapBetterAuthApiErrorToCoreAuthError,
		})
	);
