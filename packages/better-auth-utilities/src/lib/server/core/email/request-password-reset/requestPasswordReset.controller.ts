/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/request-password-reset/requestPasswordReset.controller.ts
 * @description Server-side controller for request password reset operation with validation.
 */

import * as Effect from 'effect/Effect';
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
	Effect.gen(function* (_) {
		// 1) Validate params input with Effect-based validation pipeline
		const validatedParams = yield* _(
			validateInputEffect(
				createAuthServerApiEndpointParamsSchema(AuthServerApiEndpoints.requestPasswordReset),
				params,
				isAuthServerApiRequestPasswordResetParamsFor,
				AuthServerApiEndpoints.requestPasswordReset
			)
		);

		// 2) Call the service with the validated params
		const result = yield* _(requestPasswordResetServerService(validatedParams));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
