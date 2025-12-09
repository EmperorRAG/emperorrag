/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/get-access-token/getAccessToken.controller.ts
 * @description Server-side controller for get access token operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createGetAccessTokenServerParamsSchema } from './getAccessToken.schema';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiGetAccessTokenParamsFor, type AuthServerApiGetAccessTokenParamsFor, type getAccessTokenPropsFor } from './getAccessToken.types';
import { SessionAuthServerInputError } from '../shared/session.error';
import { getAccessTokenServerService } from './getAccessToken.service';
import { SessionAuthServerServiceTag } from '../shared/session.service';

export const getAccessTokenServerController: getAccessTokenPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiGetAccessTokenParamsFor<T>) =>
	Effect.gen(function* (_) {
		const { authServer } = yield* _(SessionAuthServerServiceTag);
		const schema = yield* _(createGetAccessTokenServerParamsSchema(authServer));

		const parsed = schema.safeParse(params);

		if (!parsed.success) {
			const message = 'Invalid get access token parameters';
			const cause = parsed.error;
			return yield* _(Effect.fail(new SessionAuthServerInputError(message, cause)));
		}

		if (!isAuthServerApiGetAccessTokenParamsFor<T>(parsed.data)) {
			const message = 'Parsed data does not conform to expected get access token parameters structure';
			return yield* _(Effect.fail(new SessionAuthServerInputError(message)));
		}

		const result = yield* _(getAccessTokenServerService(parsed.data));

		return result;
	});
