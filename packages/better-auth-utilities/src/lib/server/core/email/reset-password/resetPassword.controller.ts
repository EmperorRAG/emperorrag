/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/reset-password/resetPassword.controller.ts
 * @description Controller for server-side reset password operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createResetPasswordServerParamsSchema } from './resetPassword.schema';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiResetPasswordParamsFor, type AuthServerApiResetPasswordParamsFor, type resetPasswordPropsFor } from './resetPassword.types';
import { validateInputEffect } from '../shared/email.error';
import { resetPasswordServerService } from './resetPassword.service';
import { EmailAuthServerServiceTag } from '../shared/email.service';

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
 * @returns Effect requiring EmailAuthServerService context
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { resetPasswordServerController } from './resetPassword.controller';
 *
 * const program = resetPasswordServerController({
 *   body: {
 *     token: 'secure-reset-token',
 *     newPassword: 'newSecurePassword123'
 *   },
 *   headers: requestHeaders
 * });
 *
 * await Effect.runPromise(
 *   program.pipe(Effect.provideService(EmailAuthServerServiceTag, { authServer }))
 * );
 * ```
 */
export const resetPasswordServerController: resetPasswordPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiResetPasswordParamsFor<T>) =>
	Effect.gen(function* (_) {
		const { authServer } = yield* _(EmailAuthServerServiceTag);

		// 1) Validate params input with Effect-based validation pipeline
		const validatedParams = yield* _(
			validateInputEffect(createResetPasswordServerParamsSchema(authServer), params, isAuthServerApiResetPasswordParamsFor<T>, 'resetPassword')
		);

		// 2) Call the service with the validated params
		const result = yield* _(resetPasswordServerService(validatedParams));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
