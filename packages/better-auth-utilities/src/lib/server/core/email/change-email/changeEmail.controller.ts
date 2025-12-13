/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/change-email/changeEmail.controller.ts
 * @description Server-side controller for change email operation with validation.
 */

import * as Effect from 'effect/Effect';
import { PipelineContext } from '../../../../context/pipeline.context';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import { validateInputEffect } from '../../../../pipeline/zod-input-validator/zodInputValidator';
import { createAuthServerApiEndpointParamsSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import type { AuthServerFor } from '../../../server.types';
import { changeEmailServerService } from './changeEmail.service';
import { isAuthServerApiChangeEmailParamsFor, type AuthServerApiChangeEmailParamsFor, type changeEmailPropsFor } from './changeEmail.types';

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
export const changeEmailServerController: changeEmailPropsFor = (params: AuthServerApiChangeEmailParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		// 1) Validate params input with Effect-based validation pipeline
		const validatedParams = yield* validateInputEffect(createAuthServerApiEndpointParamsSchema())(isAuthServerApiChangeEmailParamsFor)(params);

		// 2) Call the service with the validated params
		const result = yield* changeEmailServerService(validatedParams);

		// 3) Return the success value of the whole controller Effect
		return result;
	}).pipe(
		Effect.provideService(PipelineContext, {
			endpoint: AuthServerApiEndpoints.ChangeEmail(),
		})
	);
