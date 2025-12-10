/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-other-sessions/revokeOtherSessions.service.ts
 * @description Server-side service for revoke other sessions operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerApiRevokeOtherSessionsParamsFor, revokeOtherSessionsPropsFor } from './revokeOtherSessions.types';
import { mapBetterAuthApiErrorToCoreAuthError } from '../../shared/core.error';
import type { AuthServerFor } from '../../../server.types';
import { AuthServerTag } from '../../../server.service';

export const revokeOtherSessionsServerService: revokeOtherSessionsPropsFor = (
	params: AuthServerApiRevokeOtherSessionsParamsFor<AuthServerFor>
) =>
	Effect.flatMap(AuthServerTag, (authServer) =>
		Effect.tryPromise({
			try: () => authServer.api.revokeOtherSessions(params),
			catch: mapBetterAuthApiErrorToCoreAuthError,
		})
	);
