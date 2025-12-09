/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/forget-password-callback/forgetPasswordCallback.controller.ts
 * @description Server-side controller for forget password callback operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createForgetPasswordCallbackServerParamsSchema } from './forgetPasswordCallback.schema';
import type { AuthServerFor } from '../../../server.types';
import {
	isAuthServerApiForgetPasswordCallbackParamsFor,
	type AuthServerApiForgetPasswordCallbackParamsFor,
	type forgetPasswordCallbackPropsFor,
} from './forgetPasswordCallback.types';
import { EmailAuthServerInputError } from '../shared/email.error';
import { forgetPasswordCallbackServerService } from './forgetPasswordCallback.service';
import { EmailAuthServerServiceTag } from '../shared/email.service';

export const forgetPasswordCallbackServerController: forgetPasswordCallbackPropsFor = <T extends AuthServerFor = AuthServerFor>(
	params: AuthServerApiForgetPasswordCallbackParamsFor<T>
) =>
	Effect.gen(function* (_) {
		const { authServer } = yield* _(EmailAuthServerServiceTag);
		const schema = yield* _(createForgetPasswordCallbackServerParamsSchema(authServer));

		const parsed = schema.safeParse(params);

		if (!parsed.success) {
			const message = 'Invalid forget password callback parameters';
			const cause = parsed.error;
			return yield* _(Effect.fail(new EmailAuthServerInputError(message, cause)));
		}

		if (!isAuthServerApiForgetPasswordCallbackParamsFor<T>(parsed.data)) {
			const message = 'Parsed data does not conform to expected forget password callback parameters structure';
			return yield* _(Effect.fail(new EmailAuthServerInputError(message)));
		}

		const result = yield* _(forgetPasswordCallbackServerService(parsed.data));

		return result;
	});
