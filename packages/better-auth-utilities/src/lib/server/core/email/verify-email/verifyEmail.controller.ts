/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/verify-email/verifyEmail.controller.ts
 * @description Server-side controller for verify email operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createVerifyEmailServerParamsSchema } from './verifyEmail.schema';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiVerifyEmailParamsFor, type AuthServerApiVerifyEmailParamsFor, type verifyEmailPropsFor } from './verifyEmail.types';
import { validateInputEffect } from '../shared/email.error';
import { verifyEmailServerService } from './verifyEmail.service';
import { EmailAuthServerServiceTag } from '../shared/email.service';

/**
 * Controller for verify email operation with Zod validation and type narrowing.
 *
 * @pure
 * @description Validates input parameters using dynamic Zod schema, narrows types
 * using type guard, then delegates to the service layer.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - The verify email parameters to validate and process
 * @returns Effect that resolves to verification result or fails with validation/API error
 */
export const verifyEmailServerController: verifyEmailPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiVerifyEmailParamsFor<T>) =>
	Effect.gen(function* (_) {
		const { authServer } = yield* _(EmailAuthServerServiceTag);

		// 1) Validate params input with Effect-based validation pipeline
		const validatedParams = yield* _(
			validateInputEffect(createVerifyEmailServerParamsSchema(authServer), params, isAuthServerApiVerifyEmailParamsFor<T>, 'verifyEmail')
		);

		// 2) Call the service with the validated params
		const result = yield* _(verifyEmailServerService(validatedParams));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
