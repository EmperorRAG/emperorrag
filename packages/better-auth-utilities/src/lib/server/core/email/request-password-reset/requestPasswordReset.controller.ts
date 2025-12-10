/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/request-password-reset/requestPasswordReset.controller.ts
 * @description Server-side controller for request password reset operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createRequestPasswordResetServerParamsSchema } from './requestPasswordReset.schema';
import type { AuthServerFor } from '../../../server.types';
import {
	isAuthServerApiRequestPasswordResetParamsFor,
	type AuthServerApiRequestPasswordResetParamsFor,
	type requestPasswordResetPropsFor,
} from './requestPasswordReset.types';
import { validateInputEffect } from '../shared/email.error';
import { requestPasswordResetServerService } from './requestPasswordReset.service';
import { EmailAuthServerServiceTag } from '../shared/email.service';

export const requestPasswordResetServerController: requestPasswordResetPropsFor = <T extends AuthServerFor = AuthServerFor>(
	params: AuthServerApiRequestPasswordResetParamsFor<T>
) =>
	Effect.gen(function* (_) {
		const { authServer } = yield* _(EmailAuthServerServiceTag);

		// 1) Validate params input with Effect-based validation pipeline
		const validatedParams = yield* _(
			validateInputEffect(
				createRequestPasswordResetServerParamsSchema(authServer),
				params,
				isAuthServerApiRequestPasswordResetParamsFor<T>,
				'requestPasswordReset'
			)
		);

		// 2) Call the service with the validated params
		const result = yield* _(requestPasswordResetServerService(validatedParams));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
