/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/forget-password-callback/forgetPasswordCallback.service.ts
 * @description Server-side service for forget password callback operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import { APIError } from 'better-auth/api';
import type { AuthServerApiForgetPasswordCallbackParamsFor, forgetPasswordCallbackPropsFor } from './forgetPasswordCallback.types';
import { EmailAuthServerApiError } from '../shared/email.error';
import type { AuthServerFor } from '../../../server.types';
import { EmailAuthServerServiceTag } from '../shared/email.service';

export const forgetPasswordCallbackServerService: forgetPasswordCallbackPropsFor = <T extends AuthServerFor = AuthServerFor>(
	params: AuthServerApiForgetPasswordCallbackParamsFor<T>
) =>
	Effect.flatMap(EmailAuthServerServiceTag, ({ authServer }) =>
		Effect.tryPromise({
			try: () => authServer.api.forgetPasswordCallback(params),
			catch: (error) => {
				if (error instanceof APIError) {
					const status = typeof error.status === 'number' ? error.status : parseInt(error.status as string, 10) || undefined;
					return new EmailAuthServerApiError(error.message, status, error);
				}
				const message = error instanceof Error ? error.message : 'Forget password callback failed';
				return new EmailAuthServerApiError(message, undefined, error);
			},
		})
	);
