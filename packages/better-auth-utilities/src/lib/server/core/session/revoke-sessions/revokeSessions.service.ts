/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-sessions/revokeSessions.service.ts
 * @description Server-side service for revoke all sessions operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerApiRevokeSessionsParamsFor, revokeSessionsPropsFor } from './revokeSessions.types';
import { mapBetterAuthApiErrorToCoreAuthError } from '../../shared/core.error';
import type { AuthServerFor } from '../../../server.types';
import { AuthServerTag } from '../../../server.service';

export const revokeSessionsServerService: revokeSessionsPropsFor = (params: AuthServerApiRevokeSessionsParamsFor<AuthServerFor>) =>
	Effect.flatMap(AuthServerTag, (authServer) =>
		Effect.tryPromise({
			try: () => authServer.api.revokeSessions(params),
			catch: mapBetterAuthApiErrorToCoreAuthError,
		})
	);
