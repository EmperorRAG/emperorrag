/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/verify-email/verifyEmail.controller.ts
 * @description Server-side controller for verify email operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createAuthSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiVerifyEmailParamsFor, type AuthServerApiVerifyEmailParamsFor, type verifyEmailPropsFor } from './verifyEmail.types';
import { validateInputEffect } from '../../shared/core.error';
import { verifyEmailServerService } from './verifyEmail.service';

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
	Effect.gen(function* (_) {
		// 1) Validate params input with Effect-based validation pipeline
		const validatedParams = yield* _(
			validateInputEffect(createAuthSchema(AuthServerApiEndpoints.verifyEmail), params, isAuthServerApiVerifyEmailParamsFor, 'verifyEmail')
		);

		// 2) Call the service with the validated params
		const result = yield* _(verifyEmailServerService(validatedParams));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
