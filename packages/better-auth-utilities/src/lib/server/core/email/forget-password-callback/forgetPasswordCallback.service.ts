/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/forget-password-callback/forgetPasswordCallback.service.ts
 * @description Server-side service for forget password callback operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerApiForgetPasswordCallbackParamsFor, forgetPasswordCallbackPropsFor } from './forgetPasswordCallback.types';
import { mapBetterAuthApiErrorToEmailAuthError } from '../shared/email.error';
import type { AuthServerFor } from '../../../server.types';
import { EmailAuthServerServiceTag } from '../shared/email.service';

export const forgetPasswordCallbackServerService: forgetPasswordCallbackPropsFor = <T extends AuthServerFor = AuthServerFor>(
	params: AuthServerApiForgetPasswordCallbackParamsFor<T>
) =>
	Effect.flatMap(EmailAuthServerServiceTag, ({ authServer }) =>
		Effect.tryPromise({
			try: () => authServer.api.forgetPasswordCallback(params),
			catch: mapBetterAuthApiErrorToEmailAuthError,
		})
	);
