/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/request-password-reset/requestPasswordReset.controller.ts
 * @description Server-side controller for request password reset operation with validation.
 */

import * as Effect from 'effect/Effect';
import { PipelineContext } from '../../../../context/pipeline.context';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import { validateInputEffect } from '../../../../pipeline/zod-input-validator/zodInputValidator';
import { createAuthServerApiEndpointParamsSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import type { AuthServerFor } from '../../../server.types';
import { requestPasswordResetServerService } from './requestPasswordReset.service';
import {
	isAuthServerApiRequestPasswordResetParamsFor,
	type AuthServerApiRequestPasswordResetParamsFor,
	type requestPasswordResetPropsFor,
} from './requestPasswordReset.types';

export const requestPasswordResetServerController: requestPasswordResetPropsFor = (params: AuthServerApiRequestPasswordResetParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		// 1) Validate params input with Effect-based validation pipeline
		const validatedParams = yield* validateInputEffect(createAuthServerApiEndpointParamsSchema())(isAuthServerApiRequestPasswordResetParamsFor)(params);

		// 2) Call the service with the validated params
		const result = yield* requestPasswordResetServerService(validatedParams);

		// 3) Return the success value of the whole controller Effect
		return result;
	}).pipe(
		Effect.provideService(PipelineContext, {
			endpoint: AuthServerApiEndpoints.RequestPasswordReset(),
		})
	);
