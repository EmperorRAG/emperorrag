/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/request-password-reset/requestPasswordReset.controller.ts
 * @description Server-side controller for request password reset operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createAuthSchema, emailWithRedirectBodySchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import type { AuthServerFor } from '../../../server.types';
import {
	isAuthServerApiRequestPasswordResetParamsFor,
	type AuthServerApiRequestPasswordResetParamsFor,
	type requestPasswordResetPropsFor,
} from './requestPasswordReset.types';
import { validateInputEffect } from '../../shared/core.error';
import { requestPasswordResetServerService } from './requestPasswordReset.service';

export const requestPasswordResetServerController: requestPasswordResetPropsFor = (params: AuthServerApiRequestPasswordResetParamsFor<AuthServerFor>) =>
	Effect.gen(function* (_) {
		// 1) Validate params input with Effect-based validation pipeline
		const validatedParams = yield* _(
			validateInputEffect(
				createAuthSchema({ body: emailWithRedirectBodySchema, headers: 'optional' }),
				params,
				isAuthServerApiRequestPasswordResetParamsFor,
				'requestPasswordReset'
			)
		);

		// 2) Call the service with the validated params
		const result = yield* _(requestPasswordResetServerService(validatedParams));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
