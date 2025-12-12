/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/refresh-token/refreshToken.service.ts
 * @description Server-side service for refresh token operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import { mapApiError } from '../../../../pipeline/map-api-error/mapApiError';
import { AuthServerTag } from '../../../server.service';
import type { AuthServerFor } from '../../../server.types';
import type { AuthServerApiRefreshTokenParamsFor, refreshTokenPropsFor } from './refreshToken.types';

export const refreshTokenServerService: refreshTokenPropsFor = (params: AuthServerApiRefreshTokenParamsFor<AuthServerFor>) =>
	Effect.flatMap(AuthServerTag, (authServer) => Effect.tryPromise(() => authServer.api.refreshToken(params)).pipe(Effect.catchAll(mapApiError)));
