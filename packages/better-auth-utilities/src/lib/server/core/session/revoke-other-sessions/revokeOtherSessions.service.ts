/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-other-sessions/revokeOtherSessions.service.ts
 * @description Server-side service for revoke other sessions operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import { AuthServerTag } from '../../../server.service';
import type { AuthServerFor } from '../../../server.types';
import { mapApiError } from '../../shared/core.error';
import type { AuthServerApiRevokeOtherSessionsParamsFor, revokeOtherSessionsPropsFor } from './revokeOtherSessions.types';

export const revokeOtherSessionsServerService: revokeOtherSessionsPropsFor = (params: AuthServerApiRevokeOtherSessionsParamsFor<AuthServerFor>) =>
	Effect.flatMap(AuthServerTag, (authServer) =>
		Effect.tryPromise({
			try: () => authServer.api.revokeOtherSessions(params),
			catch: mapApiError,
		})
	);
