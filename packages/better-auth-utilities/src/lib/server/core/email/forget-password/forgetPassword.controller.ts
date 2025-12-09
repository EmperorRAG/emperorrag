/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/forget-password/forgetPassword.controller.ts
 * @description Controller for server-side forget password operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createForgetPasswordServerParamsSchema } from './forgetPassword.schema';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiForgetPasswordParamsFor, type AuthServerApiForgetPasswordParamsFor, type forgetPasswordPropsFor } from './forgetPassword.types';
import { EmailAuthServerInputError } from '../shared/email.error';
import { forgetPasswordServerService } from './forgetPassword.service';
import { EmailAuthServerServiceTag } from '../shared/email.service';

/**
 * Controller for forget password operation with input validation.
 *
 * @pure
 * @description Validates input parameters using dynamically generated Zod schema,
 * then delegates to the service layer. Uses type guard for proper type narrowing.
 *
 * @remarks
 * **Validation Flow:**
 * 1. Retrieve authServer from Effect context
 * 2. Generate Zod schema dynamically
 * 3. Validate input parameters
 * 4. Use type guard to narrow the type
 * 5. Call service with validated params
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - The forget password parameters to validate and process
 * @returns Effect requiring EmailAuthServerService context
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { forgetPasswordServerController } from './forgetPassword.controller';
 *
 * const program = forgetPasswordServerController({
 *   body: {
 *     email: 'user@example.com',
 *     redirectTo: 'https://example.com/reset'
 *   }
 * });
 *
 * await Effect.runPromise(
 *   program.pipe(Effect.provideService(EmailAuthServerServiceTag, { authServer }))
 * );
 * ```
 */
export const forgetPasswordServerController: forgetPasswordPropsFor = <T extends AuthServerFor = AuthServerFor>(
	params: AuthServerApiForgetPasswordParamsFor<T>
) =>
	Effect.gen(function* (_) {
		const { authServer } = yield* _(EmailAuthServerServiceTag);
		const schema = yield* _(createForgetPasswordServerParamsSchema(authServer));

		// 1) Validate params input with Zod
		const parsed = schema.safeParse(params);

		if (!parsed.success) {
			const message = 'Invalid forget password parameters';
			const cause = parsed.error;
			return yield* _(Effect.fail(new EmailAuthServerInputError(message, cause)));
		}

		if (!isAuthServerApiForgetPasswordParamsFor<T>(parsed.data)) {
			const message = 'Parsed data does not conform to expected forget password parameters structure';
			return yield* _(Effect.fail(new EmailAuthServerInputError(message)));
		}

		// 2) Call the service with the validated params
		const result = yield* _(forgetPasswordServerService(parsed.data));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
