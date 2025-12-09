/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/request-password-reset-callback/requestPasswordResetCallback.controller.ts
 * @description Server-side controller for request password reset callback operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createRequestPasswordResetCallbackServerParamsSchema } from './requestPasswordResetCallback.schema';
import type { AuthServerFor } from '../../../server.types';
import {
	isAuthServerApiRequestPasswordResetCallbackParamsFor,
	type AuthServerApiRequestPasswordResetCallbackParamsFor,
	type requestPasswordResetCallbackPropsFor,
} from './requestPasswordResetCallback.types';
import { EmailAuthServerInputError } from '../shared/email.error';
import { requestPasswordResetCallbackServerService } from './requestPasswordResetCallback.service';
import { EmailAuthServerServiceTag } from '../shared/email.service';

export const requestPasswordResetCallbackServerController: requestPasswordResetCallbackPropsFor = <T extends AuthServerFor = AuthServerFor>(
	params: AuthServerApiRequestPasswordResetCallbackParamsFor<T>
) =>
	Effect.gen(function* (_) {
		const { authServer } = yield* _(EmailAuthServerServiceTag);
		const schema = yield* _(createRequestPasswordResetCallbackServerParamsSchema(authServer));

		const parsed = schema.safeParse(params);

		if (!parsed.success) {
			const message = 'Invalid request password reset callback parameters';
			const cause = parsed.error;
			return yield* _(Effect.fail(new EmailAuthServerInputError(message, cause)));
		}

		if (!isAuthServerApiRequestPasswordResetCallbackParamsFor<T>(parsed.data)) {
			const message = 'Parsed data does not conform to expected request password reset callback parameters structure';
			return yield* _(Effect.fail(new EmailAuthServerInputError(message)));
		}

		const result = yield* _(requestPasswordResetCallbackServerService(parsed.data));

		return result;
	});
