/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/forget-password/forgetPassword.controller.ts
 * @description Controller for server-side forget password operation with validation.
 */

import * as Effect from 'effect/Effect';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import { validateInputEffect } from '../../../../pipeline/zod-input-validator/zodInputValidator';
import { createAuthServerApiEndpointParamsSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import type { AuthServerFor } from '../../../server.types';
import { forgetPasswordServerService } from './forgetPassword.service';
import { isAuthServerApiForgetPasswordParamsFor, type AuthServerApiForgetPasswordParamsFor, type forgetPasswordPropsFor } from './forgetPassword.types';

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
 * @returns Effect requiring AuthServerTag context
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
 *   program.pipe(Effect.provideService(AuthServerTag, authServer))
 * );
 * ```
 */
export const forgetPasswordServerController: forgetPasswordPropsFor = (params: AuthServerApiForgetPasswordParamsFor<AuthServerFor>) =>
	Effect.gen(function* (_) {
		const validatedParams = yield* _(
			validateInputEffect(
				createAuthServerApiEndpointParamsSchema(AuthServerApiEndpoints.forgetPassword),
				params,
				isAuthServerApiForgetPasswordParamsFor,
				AuthServerApiEndpoints.forgetPassword
			)
		);
		return yield* _(forgetPasswordServerService(validatedParams));
	});
