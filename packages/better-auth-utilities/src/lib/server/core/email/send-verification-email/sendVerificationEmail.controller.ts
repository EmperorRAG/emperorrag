/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/send-verification-email/sendVerificationEmail.controller.ts
 * @description Controller for server-side send verification email operation with validation.
 */

import * as Effect from 'effect/Effect';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import { validateInputEffect } from '../../../../pipeline/zod-input-validator/zodInputValidator';
import { createAuthServerApiEndpointParamsSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import type { AuthServerFor } from '../../../server.types';
import { sendVerificationEmailServerService } from './sendVerificationEmail.service';
import {
	isAuthServerApiSendVerificationEmailParamsFor,
	type AuthServerApiSendVerificationEmailParamsFor,
	type sendVerificationEmailPropsFor,
} from './sendVerificationEmail.types';

/**
 * Controller for send verification email operation with input validation.
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
 * @param params - The send verification email parameters to validate and process
 * @returns Effect requiring AuthServerTag context
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { sendVerificationEmailServerController } from './sendVerificationEmail.controller';
 *
 * const program = sendVerificationEmailServerController({
 *   body: {
 *     email: 'user@example.com',
 *     callbackURL: 'https://example.com/verify'
 *   }
 * });
 *
 * await Effect.runPromise(
```
 *   program.pipe(Effect.provideService(AuthServerTag, authServer))
 * );
 * ```
 */
export const sendVerificationEmailServerController: sendVerificationEmailPropsFor = (params: AuthServerApiSendVerificationEmailParamsFor<AuthServerFor>) =>
	Effect.gen(function* (_) {
		// 1) Validate params input with Effect-based validation pipeline
		const validatedParams = yield* _(
			validateInputEffect(
				createAuthServerApiEndpointParamsSchema(AuthServerApiEndpoints.sendVerificationEmail),
				params,
				isAuthServerApiSendVerificationEmailParamsFor,
				AuthServerApiEndpoints.sendVerificationEmail
			)
		);

		// 2) Call the service with the validated params
		const result = yield* _(sendVerificationEmailServerService(validatedParams));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
