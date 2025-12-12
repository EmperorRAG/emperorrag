/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/request-password-reset-callback/requestPasswordResetCallback.service.ts
 * @description Server-side service for request password reset callback operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import { mapApiError } from '../../../../errors/authServer.error';
import { AuthServerTag } from '../../../server.service';
import type { AuthServerFor } from '../../../server.types';
import type { AuthServerApiRequestPasswordResetCallbackParamsFor, requestPasswordResetCallbackPropsFor } from './requestPasswordResetCallback.types';

export const requestPasswordResetCallbackServerService: requestPasswordResetCallbackPropsFor = (
	params: AuthServerApiRequestPasswordResetCallbackParamsFor<AuthServerFor>
) =>
	Effect.flatMap(AuthServerTag, (authServer) =>
		Effect.tryPromise({
			try: () => authServer.api.requestPasswordResetCallback(params),
			catch: mapApiError,
		})
	);
