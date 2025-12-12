/**
 * @file libs/better-auth-utilities/src/lib/server/core/user/delete-user-callback/deleteUserCallback.service.ts
 * @description Server-side service for delete user callback operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import { mapApiError } from '../../../../pipeline/map-api-error/mapApiError';
import { AuthServerTag } from '../../../server.service';
import type { AuthServerFor } from '../../../server.types';
import type { AuthServerApiDeleteUserCallbackParamsFor, deleteUserCallbackPropsFor } from './deleteUserCallback.types';

export const deleteUserCallbackServerService: deleteUserCallbackPropsFor = (params: AuthServerApiDeleteUserCallbackParamsFor<AuthServerFor>) =>
	Effect.flatMap(AuthServerTag, (authServer) => Effect.tryPromise(() => authServer.api.deleteUserCallback(params)).pipe(Effect.catchAll(mapApiError)));
