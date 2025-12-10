/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/request-password-reset-callback/requestPasswordResetCallback.service.ts
 * @description Server-side service for request password reset callback operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerApiRequestPasswordResetCallbackParamsFor, requestPasswordResetCallbackPropsFor } from './requestPasswordResetCallback.types';
import { mapBetterAuthApiErrorToEmailAuthError } from '../shared/email.error';
import type { AuthServerFor } from '../../../server.types';
import { EmailAuthServerServiceTag } from '../shared/email.service';

export const requestPasswordResetCallbackServerService: requestPasswordResetCallbackPropsFor = <T extends AuthServerFor = AuthServerFor>(
	params: AuthServerApiRequestPasswordResetCallbackParamsFor<T>
) =>
	Effect.flatMap(EmailAuthServerServiceTag, ({ authServer }) =>
		Effect.tryPromise({
			try: () => authServer.api.requestPasswordResetCallback(params),
			catch: mapBetterAuthApiErrorToEmailAuthError,
		})
	);
