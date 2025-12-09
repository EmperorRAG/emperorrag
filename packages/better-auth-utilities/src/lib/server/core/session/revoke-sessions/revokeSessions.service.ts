/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-sessions/revokeSessions.service.ts
 * @description Server-side service for revoke all sessions operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import { APIError } from 'better-auth/api';
import type { AuthServerApiRevokeSessionsParamsFor, revokeSessionsPropsFor } from './revokeSessions.types';
import { SessionAuthServerApiError } from '../shared/session.error';
import type { AuthServerFor } from '../../../server.types';
import { SessionAuthServerServiceTag } from '../shared/session.service';

export const revokeSessionsServerService: revokeSessionsPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiRevokeSessionsParamsFor<T>) =>
	Effect.flatMap(SessionAuthServerServiceTag, ({ authServer }) =>
		Effect.tryPromise({
			try: () => authServer.api.revokeSessions(params),
			catch: (error) => {
				if (error instanceof APIError) {
					const status = typeof error.status === 'number' ? error.status : parseInt(error.status as string, 10) || undefined;
					return new SessionAuthServerApiError(error.message, status, error);
				}
				const message = error instanceof Error ? error.message : 'Revoke sessions failed';
				return new SessionAuthServerApiError(message, undefined, error);
			},
		})
	);
