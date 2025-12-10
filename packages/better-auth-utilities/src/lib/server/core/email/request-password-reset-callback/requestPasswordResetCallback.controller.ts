/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/request-password-reset-callback/requestPasswordResetCallback.controller.ts
 * @description Server-side controller for request password reset callback operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createRequestPasswordResetCallbackServerParamsSchema } from './requestPasswordResetCallback.schema';
import type { AuthServerFor } from '../../../server.types';
import {
	isAuthServerApiRequestPasswordResetCallbackParamsFor,
	type AuthServerApiRequestPasswordResetCallbackParamsFor,
	type requestPasswordResetCallbackPropsFor,
} from './requestPasswordResetCallback.types';
import { validateInputEffect } from '../../shared/core.error';
import { requestPasswordResetCallbackServerService } from './requestPasswordResetCallback.service';

export const requestPasswordResetCallbackServerController: requestPasswordResetCallbackPropsFor = (
	params: AuthServerApiRequestPasswordResetCallbackParamsFor<AuthServerFor>
) =>
	Effect.gen(function* (_) {

		// 1) Validate params input with Effect-based validation pipeline
		const validatedParams = yield* _(
			validateInputEffect(
				createRequestPasswordResetCallbackServerParamsSchema(),
				params,
				isAuthServerApiRequestPasswordResetCallbackParamsFor,
				'requestPasswordResetCallback'
			)
		);

		// 2) Call the service with the validated params
		const result = yield* _(requestPasswordResetCallbackServerService(validatedParams));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
