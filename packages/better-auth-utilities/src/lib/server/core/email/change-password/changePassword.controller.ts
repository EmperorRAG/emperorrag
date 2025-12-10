/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/change-password/changePassword.controller.ts
 * @description Controller for server-side change password operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createChangePasswordServerParamsSchema } from './changePassword.schema';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiChangePasswordParamsFor, type AuthServerApiChangePasswordParamsFor, type changePasswordPropsFor } from './changePassword.types';
import { validateInputEffect } from '../shared/email.error';
import { changePasswordServerService } from './changePassword.service';
import { EmailAuthServerServiceTag } from '../shared/email.service';

/**
 * Controller for change password operation with input validation.
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
 * @param params - The change password parameters to validate and process
 * @returns Effect requiring EmailAuthServerService context
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { changePasswordServerController } from './changePassword.controller';
 *
 * const program = changePasswordServerController({
 *   body: {
 *     currentPassword: 'oldPassword123',
 *     newPassword: 'newSecurePassword456',
 *     revokeOtherSessions: true
 *   },
 *   headers: requestHeaders
 * });
 *
 * await Effect.runPromise(
 *   program.pipe(Effect.provideService(EmailAuthServerServiceTag, { authServer }))
 * );
 * ```
 */
export const changePasswordServerController: changePasswordPropsFor = <T extends AuthServerFor = AuthServerFor>(
	params: AuthServerApiChangePasswordParamsFor<T>
) =>
	Effect.gen(function* (_) {
		const { authServer } = yield* _(EmailAuthServerServiceTag);

		// 1) Validate params input with Effect-based validation pipeline
		const validatedParams = yield* _(
			validateInputEffect(createChangePasswordServerParamsSchema(authServer), params, isAuthServerApiChangePasswordParamsFor<T>, 'changePassword')
		);

		// 2) Call the service with the validated params
		const result = yield* _(changePasswordServerService(validatedParams));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
