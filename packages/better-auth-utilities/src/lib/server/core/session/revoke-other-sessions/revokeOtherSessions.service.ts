/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-other-sessions/revokeOtherSessions.service.ts
 * @description Server-side service for revoke other sessions operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerApiRevokeOtherSessionsParamsFor, revokeOtherSessionsPropsFor } from './revokeOtherSessions.types';
import { mapBetterAuthApiErrorToCoreAuthError } from '../../shared/core.error';
import type { AuthServerFor } from '../../../server.types';
import { SessionAuthServerServiceTag } from '../shared/session.service';

export const revokeOtherSessionsServerService: revokeOtherSessionsPropsFor = <T extends AuthServerFor = AuthServerFor>(
	params: AuthServerApiRevokeOtherSessionsParamsFor<T>
) =>
	Effect.flatMap(SessionAuthServerServiceTag, ({ authServer }) =>
		Effect.tryPromise({
			try: () => authServer.api.revokeOtherSessions(params),
			catch: mapBetterAuthApiErrorToCoreAuthError,
		})
	);
