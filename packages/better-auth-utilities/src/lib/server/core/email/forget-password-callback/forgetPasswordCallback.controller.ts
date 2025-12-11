/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/forget-password-callback/forgetPasswordCallback.controller.ts
 * @description Server-side controller for forget password callback operation with validation.
 */

import * as Effect from 'effect/Effect';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import { validateInputEffect } from '../../../../pipeline/zod-input-validator/zodInputValidator';
import { createAuthServerApiEndpointParamsSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import type { AuthServerFor } from '../../../server.types';
import { forgetPasswordCallbackServerService } from './forgetPasswordCallback.service';
import {
	isAuthServerApiForgetPasswordCallbackParamsFor,
	type AuthServerApiForgetPasswordCallbackParamsFor,
	type forgetPasswordCallbackPropsFor,
} from './forgetPasswordCallback.types';

export const forgetPasswordCallbackServerController: forgetPasswordCallbackPropsFor = (params: AuthServerApiForgetPasswordCallbackParamsFor<AuthServerFor>) =>
	Effect.gen(function* (_) {
		// 1) Validate params input with Effect-based validation pipeline
		const validatedParams = yield* _(
			validateInputEffect(
				createAuthServerApiEndpointParamsSchema(AuthServerApiEndpoints.forgetPasswordCallback),
				params,
				isAuthServerApiForgetPasswordCallbackParamsFor,
				AuthServerApiEndpoints.forgetPasswordCallback
			)
		);

		// 2) Call the service with the validated params
		const result = yield* _(forgetPasswordCallbackServerService(validatedParams));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
