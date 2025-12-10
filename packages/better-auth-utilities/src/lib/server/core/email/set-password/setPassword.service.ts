/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/set-password/setPassword.service.ts
 * @description Server-side service for set password operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerApiSetPasswordParamsFor, setPasswordPropsFor } from './setPassword.types';
import { mapBetterAuthApiErrorToEmailAuthError } from '../shared/email.error';
import type { AuthServerFor } from '../../../server.types';
import { EmailAuthServerServiceTag } from '../shared/email.service';

/**
 * Set user password via Better Auth server API.
 *
 * @pure
 * @description Wraps auth.api.setPassword in an Effect, converting Promise-based
 * errors into typed EmailAuthServerApiError failures. Typically used for OAuth-only accounts.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - The set password parameters containing body with newPassword
 * @returns Effect that resolves to set password result or fails with EmailAuthServerApiError
 */
export const setPasswordServerService: setPasswordPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiSetPasswordParamsFor<T>) =>
	Effect.flatMap(EmailAuthServerServiceTag, ({ authServer }) =>
		Effect.tryPromise({
			try: () => authServer.api.setPassword(params),
			catch: mapBetterAuthApiErrorToEmailAuthError,
		})
	);
