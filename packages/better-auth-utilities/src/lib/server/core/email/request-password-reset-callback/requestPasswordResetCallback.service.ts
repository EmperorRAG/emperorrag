/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/request-password-reset-callback/requestPasswordResetCallback.service.ts
 * @description Server-side service for request password reset callback operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import { APIError } from 'better-auth/api';
import type { AuthServerApiRequestPasswordResetCallbackParamsFor, requestPasswordResetCallbackPropsFor } from './requestPasswordResetCallback.types';
import { EmailAuthServerApiError } from '../shared/email.error';
import type { AuthServerFor } from '../../../server.types';
import { EmailAuthServerServiceTag } from '../shared/email.service';

export const requestPasswordResetCallbackServerService: requestPasswordResetCallbackPropsFor = <T extends AuthServerFor = AuthServerFor>(
	params: AuthServerApiRequestPasswordResetCallbackParamsFor<T>
) =>
	Effect.flatMap(EmailAuthServerServiceTag, ({ authServer }) =>
		Effect.tryPromise({
			try: () => authServer.api.requestPasswordResetCallback(params),
			catch: (error) => {
				if (error instanceof APIError) {
					const status = typeof error.status === 'number' ? error.status : parseInt(error.status as string, 10) || undefined;
					return new EmailAuthServerApiError(error.message, status, error);
				}
				const message = error instanceof Error ? error.message : 'Request password reset callback failed';
				return new EmailAuthServerApiError(message, undefined, error);
			},
		})
	);
