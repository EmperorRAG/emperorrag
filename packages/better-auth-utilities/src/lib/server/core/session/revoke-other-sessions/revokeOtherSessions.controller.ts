/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-other-sessions/revokeOtherSessions.controller.ts
 * @description Server-side controller for revoke other sessions operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createRevokeOtherSessionsServerParamsSchema } from './revokeOtherSessions.schema';
import type { AuthServerFor } from '../../../server.types';
import {
	isAuthServerApiRevokeOtherSessionsParamsFor,
	type AuthServerApiRevokeOtherSessionsParamsFor,
	type revokeOtherSessionsPropsFor,
} from './revokeOtherSessions.types';
import { SessionAuthServerInputError } from '../shared/session.error';
import { revokeOtherSessionsServerService } from './revokeOtherSessions.service';
import { SessionAuthServerServiceTag } from '../shared/session.service';

export const revokeOtherSessionsServerController: revokeOtherSessionsPropsFor = <T extends AuthServerFor = AuthServerFor>(
	params: AuthServerApiRevokeOtherSessionsParamsFor<T>
) =>
	Effect.gen(function* (_) {
		const { authServer } = yield* _(SessionAuthServerServiceTag);
		const schema = yield* _(createRevokeOtherSessionsServerParamsSchema(authServer));

		const parsed = schema.safeParse(params);

		if (!parsed.success) {
			const message = 'Invalid revoke other sessions parameters';
			const cause = parsed.error;
			return yield* _(Effect.fail(new SessionAuthServerInputError(message, cause)));
		}

		if (!isAuthServerApiRevokeOtherSessionsParamsFor<T>(parsed.data)) {
			const message = 'Parsed data does not conform to expected revoke other sessions parameters structure';
			return yield* _(Effect.fail(new SessionAuthServerInputError(message)));
		}

		const result = yield* _(revokeOtherSessionsServerService(parsed.data));

		return result;
	});
