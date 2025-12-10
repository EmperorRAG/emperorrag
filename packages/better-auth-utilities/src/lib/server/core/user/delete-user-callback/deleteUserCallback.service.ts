/**
 * @file libs/better-auth-utilities/src/lib/server/core/user/delete-user-callback/deleteUserCallback.service.ts
 * @description Server-side service for delete user callback operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerApiDeleteUserCallbackParamsFor, deleteUserCallbackPropsFor } from './deleteUserCallback.types';
import { mapBetterAuthApiErrorToCoreAuthError } from '../../shared/core.error';
import type { AuthServerFor } from '../../../server.types';
import { UserAuthServerServiceTag } from '../shared/user.service';

export const deleteUserCallbackServerService: deleteUserCallbackPropsFor = <T extends AuthServerFor = AuthServerFor>(
	params: AuthServerApiDeleteUserCallbackParamsFor<T>
) =>
	Effect.flatMap(UserAuthServerServiceTag, ({ authServer }) =>
		Effect.tryPromise({
			try: () => authServer.api.deleteUserCallback(params),
			catch: mapBetterAuthApiErrorToCoreAuthError,
		})
	);
