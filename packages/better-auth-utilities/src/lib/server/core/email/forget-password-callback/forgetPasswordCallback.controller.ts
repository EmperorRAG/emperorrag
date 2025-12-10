/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/forget-password-callback/forgetPasswordCallback.controller.ts
 * @description Server-side controller for forget password callback operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createForgetPasswordCallbackServerParamsSchema } from './forgetPasswordCallback.schema';
import type { AuthServerFor } from '../../../server.types';
import {
	isAuthServerApiForgetPasswordCallbackParamsFor,
	type AuthServerApiForgetPasswordCallbackParamsFor,
	type forgetPasswordCallbackPropsFor,
} from './forgetPasswordCallback.types';
import { validateInputEffect } from '../shared/email.error';
import { forgetPasswordCallbackServerService } from './forgetPasswordCallback.service';
import { EmailAuthServerServiceTag } from '../shared/email.service';

export const forgetPasswordCallbackServerController: forgetPasswordCallbackPropsFor = <T extends AuthServerFor = AuthServerFor>(
	params: AuthServerApiForgetPasswordCallbackParamsFor<T>
) =>
	Effect.gen(function* (_) {
		const { authServer } = yield* _(EmailAuthServerServiceTag);

		// 1) Validate params input with Effect-based validation pipeline
		const validatedParams = yield* _(
			validateInputEffect(
				createForgetPasswordCallbackServerParamsSchema(authServer),
				params,
				isAuthServerApiForgetPasswordCallbackParamsFor<T>,
				'forgetPasswordCallback'
			)
		);

		// 2) Call the service with the validated params
		const result = yield* _(forgetPasswordCallbackServerService(validatedParams));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
