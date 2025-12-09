/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/refresh-token/refreshToken.controller.ts
 * @description Server-side controller for refresh token operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createRefreshTokenServerParamsSchema } from './refreshToken.schema';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiRefreshTokenParamsFor, type AuthServerApiRefreshTokenParamsFor, type refreshTokenPropsFor } from './refreshToken.types';
import { SessionAuthServerInputError } from '../shared/session.error';
import { refreshTokenServerService } from './refreshToken.service';
import { SessionAuthServerServiceTag } from '../shared/session.service';

export const refreshTokenServerController: refreshTokenPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiRefreshTokenParamsFor<T>) =>
	Effect.gen(function* (_) {
		const { authServer } = yield* _(SessionAuthServerServiceTag);
		const schema = yield* _(createRefreshTokenServerParamsSchema(authServer));

		const parsed = schema.safeParse(params);

		if (!parsed.success) {
			const message = 'Invalid refresh token parameters';
			const cause = parsed.error;
			return yield* _(Effect.fail(new SessionAuthServerInputError(message, cause)));
		}

		if (!isAuthServerApiRefreshTokenParamsFor<T>(parsed.data)) {
			const message = 'Parsed data does not conform to expected refresh token parameters structure';
			return yield* _(Effect.fail(new SessionAuthServerInputError(message)));
		}

		const result = yield* _(refreshTokenServerService(parsed.data));

		return result;
	});
