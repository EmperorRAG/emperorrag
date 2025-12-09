/**
 * @file libs/better-auth-utilities/src/lib/server/core/user/delete-user-callback/deleteUserCallback.service.ts
 * @description Server-side service for delete user callback operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import { APIError } from 'better-auth/api';
import type { AuthServerApiDeleteUserCallbackParamsFor, deleteUserCallbackPropsFor } from './deleteUserCallback.types';
import { UserAuthServerApiError } from '../shared/user.error';
import type { AuthServerFor } from '../../../server.types';
import { UserAuthServerServiceTag } from '../shared/user.service';

export const deleteUserCallbackServerService: deleteUserCallbackPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiDeleteUserCallbackParamsFor<T>) =>
	Effect.flatMap(UserAuthServerServiceTag, ({ authServer }) =>
		Effect.tryPromise({
			try: () => authServer.api.deleteUserCallback(params),
			catch: (error) => {
				if (error instanceof APIError) {
					const status = typeof error.status === 'number' ? error.status : parseInt(error.status as string, 10) || undefined;
					return new UserAuthServerApiError(error.message, status, error);
				}
				const message = error instanceof Error ? error.message : 'Delete user callback failed';
				return new UserAuthServerApiError(message, undefined, error);
			},
		})
	);
