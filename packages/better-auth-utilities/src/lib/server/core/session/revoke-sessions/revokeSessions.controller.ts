/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-sessions/revokeSessions.controller.ts
 * @description Server-side controller for revoke all sessions operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createRevokeSessionsServerParamsSchema } from './revokeSessions.schema';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiRevokeSessionsParamsFor, type AuthServerApiRevokeSessionsParamsFor, type revokeSessionsPropsFor } from './revokeSessions.types';
import { SessionAuthServerInputError } from '../shared/session.error';
import { revokeSessionsServerService } from './revokeSessions.service';
import { SessionAuthServerServiceTag } from '../shared/session.service';

export const revokeSessionsServerController: revokeSessionsPropsFor = <T extends AuthServerFor = AuthServerFor>(
	params: AuthServerApiRevokeSessionsParamsFor<T>
) =>
	Effect.gen(function* (_) {
		const { authServer } = yield* _(SessionAuthServerServiceTag);
		const schema = yield* _(createRevokeSessionsServerParamsSchema(authServer));

		const parsed = schema.safeParse(params);

		if (!parsed.success) {
			const message = 'Invalid revoke sessions parameters';
			const cause = parsed.error;
			return yield* _(Effect.fail(new SessionAuthServerInputError(message, cause)));
		}

		if (!isAuthServerApiRevokeSessionsParamsFor<T>(parsed.data)) {
			const message = 'Parsed data does not conform to expected revoke sessions parameters structure';
			return yield* _(Effect.fail(new SessionAuthServerInputError(message)));
		}

		const result = yield* _(revokeSessionsServerService(parsed.data));

		return result;
	});
