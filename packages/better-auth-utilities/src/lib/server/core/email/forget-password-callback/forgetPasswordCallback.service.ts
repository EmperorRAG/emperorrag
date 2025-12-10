/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/forget-password-callback/forgetPasswordCallback.service.ts
 * @description Server-side service for forget password callback operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerApiForgetPasswordCallbackParamsFor, forgetPasswordCallbackPropsFor } from './forgetPasswordCallback.types';
import { mapBetterAuthApiErrorToCoreAuthError } from '../../shared/core.error';
import type { AuthServerFor } from '../../../server.types';
import { AuthServerTag } from '../../../server.service';

export const forgetPasswordCallbackServerService: forgetPasswordCallbackPropsFor = (
	params: AuthServerApiForgetPasswordCallbackParamsFor<AuthServerFor>
) =>
	Effect.flatMap(AuthServerTag, (authServer) =>
		Effect.tryPromise({
			try: () => authServer.api.forgetPasswordCallback(params),
			catch: mapBetterAuthApiErrorToCoreAuthError,
		})
	);
