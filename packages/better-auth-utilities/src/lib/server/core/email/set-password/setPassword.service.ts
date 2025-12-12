/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/set-password/setPassword.service.ts
 * @description Server-side service for set password operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import { AuthServerTag } from '../../../server.service';
import type { AuthServerFor } from '../../../server.types';
import { mapApiError } from '../../shared/core.error';
import type { AuthServerApiSetPasswordParamsFor, setPasswordPropsFor } from './setPassword.types';

/**
 * Set user password via Better Auth server API.
 *
 * @pure
 * @description Wraps auth.api.setPassword in an Effect, converting Promise-based
 * errors into typed AuthServerApiError failures. Typically used for OAuth-only accounts.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - The set password parameters containing body with newPassword
 * @returns Effect that resolves to set password result or fails with AuthServerApiError
 */
export const setPasswordServerService: setPasswordPropsFor = (params: AuthServerApiSetPasswordParamsFor<AuthServerFor>) =>
	Effect.flatMap(AuthServerTag, (authServer) =>
		Effect.tryPromise({
			try: () => authServer.api.setPassword(params),
			catch: mapApiError,
		})
	);
