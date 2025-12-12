/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/reset-password/resetPassword.controller.ts
 * @description Controller for server-side reset password operation with validation.
 */

import * as Effect from 'effect/Effect';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import { validateInputEffect } from '../../../../pipeline/zod-input-validator/zodInputValidator';
import { createAuthServerApiEndpointParamsSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import type { AuthServerFor } from '../../../server.types';
import { resetPasswordServerService } from './resetPassword.service';
import { isAuthServerApiResetPasswordParamsFor, type AuthServerApiResetPasswordParamsFor, type resetPasswordPropsFor } from './resetPassword.types';

/**
 * Controller for reset password operation with input validation.
 *
 * @pure
 * @description Validates input parameters using dynamically generated Zod schema,
 * then delegates to the service layer. Uses type guard for proper type narrowing.
 *
 * @remarks
 * **Validation Flow:**
 * 1. Retrieve authServer from Effect context
 * 2. Generate Zod schema dynamically (with password policy from config)
 * 3. Validate input parameters
 * 4. Use type guard to narrow the type
 * 5. Call service with validated params
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - The reset password parameters to validate and process
 * @returns Effect requiring AuthServerFor context
 */
export const resetPasswordServerController: resetPasswordPropsFor = (params: AuthServerApiResetPasswordParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		// 1) Validate params input with Effect-based validation pipeline
		const validatedParams = yield* (
			validateInputEffect(
				createAuthServerApiEndpointParamsSchema(AuthServerApiEndpoints.resetPassword),
				params,
				isAuthServerApiResetPasswordParamsFor,
				AuthServerApiEndpoints.resetPassword
			)
		);

		// 2) Call the service with the validated params
		const result = yield* (resetPasswordServerService(validatedParams));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
