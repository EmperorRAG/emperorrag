/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/set-password/setPassword.controller.ts
 * @description Server-side controller for set password operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createAuthSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiSetPasswordParamsFor, type AuthServerApiSetPasswordParamsFor, type setPasswordPropsFor } from './setPassword.types';
import { validateInputEffect } from '../../shared/core.error';
import { setPasswordServerService } from './setPassword.service';

/**
 * Controller for set password operation with Zod validation and type narrowing.
 *
 * @pure
 * @description Validates input parameters using dynamic Zod schema, narrows types
 * using type guard, then delegates to the service layer.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - The set password parameters to validate and process
 * @returns Effect that resolves to set password result or fails with validation/API error
 */
export const setPasswordServerController: setPasswordPropsFor = (params: AuthServerApiSetPasswordParamsFor<AuthServerFor>) =>
	Effect.gen(function* (_) {
		// 1) Validate params input with Effect-based validation pipeline
		const validatedParams = yield* _(
			validateInputEffect(createAuthSchema(AuthServerApiEndpoints.setPassword), params, isAuthServerApiSetPasswordParamsFor, 'setPassword')
		);

		// 2) Call the service with the validated params
		const result = yield* _(setPasswordServerService(validatedParams));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
