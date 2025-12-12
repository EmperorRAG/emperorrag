/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/verify-email/verifyEmail.controller.ts
 * @description Server-side controller for verify email operation with validation.
 */

import * as Effect from 'effect/Effect';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import { validateInputEffect } from '../../../../pipeline/zod-input-validator/zodInputValidator';
import { createAuthServerApiEndpointParamsSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import type { AuthServerFor } from '../../../server.types';
import { verifyEmailServerService } from './verifyEmail.service';
import { isAuthServerApiVerifyEmailParamsFor, type AuthServerApiVerifyEmailParamsFor, type verifyEmailPropsFor } from './verifyEmail.types';

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
export const verifyEmailServerController: verifyEmailPropsFor = (params: AuthServerApiVerifyEmailParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		// 1) Validate params input with Effect-based validation pipeline
		const validatedParams = yield* (
			validateInputEffect(
				createAuthServerApiEndpointParamsSchema(AuthServerApiEndpoints.verifyEmail),
				params,
				isAuthServerApiVerifyEmailParamsFor,
				AuthServerApiEndpoints.verifyEmail
			)
		);

		// 2) Call the service with the validated params
		const result = yield* (verifyEmailServerService(validatedParams));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
