/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-sessions/revokeSessions.service.ts
 * @description Server-side service for revoke all sessions operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerApiRevokeSessionsParamsFor, revokeSessionsPropsFor } from './revokeSessions.types';
import { mapBetterAuthApiErrorToCoreAuthError } from '../../shared/core.error';
import type { AuthServerFor } from '../../../server.types';
import { SessionAuthServerServiceTag } from '../shared/session.service';

export const revokeSessionsServerService: revokeSessionsPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiRevokeSessionsParamsFor<T>) =>
	Effect.flatMap(SessionAuthServerServiceTag, ({ authServer }) =>
		Effect.tryPromise({
			try: () => authServer.api.revokeSessions(params),
			catch: mapBetterAuthApiErrorToCoreAuthError,
		})
	);
