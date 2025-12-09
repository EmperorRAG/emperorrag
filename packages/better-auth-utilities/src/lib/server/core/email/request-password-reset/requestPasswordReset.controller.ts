/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/request-password-reset/requestPasswordReset.controller.ts
 * @description Server-side controller for request password reset operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createRequestPasswordResetServerParamsSchema } from './requestPasswordReset.schema';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiRequestPasswordResetParamsFor, type AuthServerApiRequestPasswordResetParamsFor, type requestPasswordResetPropsFor } from './requestPasswordReset.types';
import { EmailAuthServerInputError } from '../shared/email.error';
import { requestPasswordResetServerService } from './requestPasswordReset.service';
import { EmailAuthServerServiceTag } from '../shared/email.service';

export const requestPasswordResetServerController: requestPasswordResetPropsFor = <T extends AuthServerFor = AuthServerFor>(
	params: AuthServerApiRequestPasswordResetParamsFor<T>
) =>
	Effect.gen(function* (_) {
		const { authServer } = yield* _(EmailAuthServerServiceTag);
		const schema = yield* _(createRequestPasswordResetServerParamsSchema(authServer));

		const parsed = schema.safeParse(params);

		if (!parsed.success) {
			const message = 'Invalid request password reset parameters';
			const cause = parsed.error;
			return yield* _(Effect.fail(new EmailAuthServerInputError(message, cause)));
		}

		if (!isAuthServerApiRequestPasswordResetParamsFor<T>(parsed.data)) {
			const message = 'Parsed data does not conform to expected request password reset parameters structure';
			return yield* _(Effect.fail(new EmailAuthServerInputError(message)));
		}

		const result = yield* _(requestPasswordResetServerService(parsed.data));

		return result;
	});
