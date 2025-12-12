/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/change-password/changePassword.controller.ts
 * @description Controller for server-side change password operation with validation.
 */

import * as Effect from 'effect/Effect';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import { validateInputEffect } from '../../../../pipeline/zod-input-validator/zodInputValidator';
import { createAuthServerApiEndpointParamsSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import type { AuthServerFor } from '../../../server.types';
import { changePasswordServerService } from './changePassword.service';
import { isAuthServerApiChangePasswordParamsFor, type AuthServerApiChangePasswordParamsFor, type changePasswordPropsFor } from './changePassword.types';

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
 * @returns Effect requiring AuthServerTag context
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { changePasswordServerController } from './changePassword.controller';
 * import { AuthServerTag } from '../../../server.service';
 *
 * const program = changePasswordServerController({
 *   body: {
```
 *     currentPassword: 'oldPassword123',
 *     newPassword: 'newSecurePassword456',
 *     revokeOtherSessions: true
 *   },
 *   headers: requestHeaders
 * });
 *
 * await Effect.runPromise(
 *   program.pipe(Effect.provideService(AuthServerTag, authServer))
 * );
 * ```
 */
export const changePasswordServerController: changePasswordPropsFor = (params: AuthServerApiChangePasswordParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		const validatedParams = yield* (
			validateInputEffect(
				createAuthServerApiEndpointParamsSchema(AuthServerApiEndpoints.changePassword),
				params,
				isAuthServerApiChangePasswordParamsFor,
				AuthServerApiEndpoints.changePassword
			)
		);

		return yield* (changePasswordServerService(validatedParams));
	});
