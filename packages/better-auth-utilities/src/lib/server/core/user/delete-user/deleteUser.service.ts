/**
 * @file libs/better-auth-utilities/src/lib/server/core/user/delete-user/deleteUser.service.ts
 * @description Server-side service for delete user operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerApiDeleteUserParamsFor, deleteUserPropsFor } from './deleteUser.types';
import { mapBetterAuthApiErrorToUserAuthError } from '../shared/user.error';
import type { AuthServerFor } from '../../../server.types';
import { UserAuthServerServiceTag } from '../shared/user.service';

/**
 * Delete user account via Better Auth server API.
 *
 * @pure
 * @description Wraps auth.api.deleteUser in an Effect, converting Promise-based
 * errors into typed UserAuthServerApiError failures.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - The delete user parameters
 * @returns Effect that resolves to delete user result or fails with UserAuthServerApiError
 */
export const deleteUserServerService: deleteUserPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiDeleteUserParamsFor<T>) =>
	Effect.flatMap(UserAuthServerServiceTag, ({ authServer }) =>
		Effect.tryPromise({
			try: () => authServer.api.deleteUser(params),
			catch: mapBetterAuthApiErrorToUserAuthError,
		})
	);
