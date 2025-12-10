/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/change-email/changeEmail.controller.ts
 * @description Server-side controller for change email operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createChangeEmailServerParamsSchema } from './changeEmail.schema';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiChangeEmailParamsFor, type AuthServerApiChangeEmailParamsFor, type changeEmailPropsFor } from './changeEmail.types';
import { validateInputEffect } from '../shared/email.error';
import { changeEmailServerService } from './changeEmail.service';
import { EmailAuthServerServiceTag } from '../shared/email.service';

/**
 * Controller for change email operation with Zod validation and type narrowing.
 *
 * @pure
 * @description Validates input parameters using dynamic Zod schema, narrows types
 * using type guard, then delegates to the service layer.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - The change email parameters to validate and process
 * @returns Effect that resolves to change email result or fails with validation/API error
 */
export const changeEmailServerController: changeEmailPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiChangeEmailParamsFor<T>) =>
	Effect.gen(function* (_) {
		const { authServer } = yield* _(EmailAuthServerServiceTag);

		// 1) Validate params input with Effect-based validation pipeline
		const validatedParams = yield* _(
			validateInputEffect(createChangeEmailServerParamsSchema(authServer), params, isAuthServerApiChangeEmailParamsFor<T>, 'changeEmail')
		);

		// 2) Call the service with the validated params
		const result = yield* _(changeEmailServerService(validatedParams));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
