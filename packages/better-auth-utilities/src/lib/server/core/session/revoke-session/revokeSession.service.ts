/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-session/revokeSession.service.ts
 * @description Server-side service for revoke session operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerApiRevokeSessionParamsFor, revokeSessionPropsFor } from './revokeSession.types';
import { mapBetterAuthApiErrorToSessionAuthError } from '../shared/session.error';
import type { AuthServerFor } from '../../../server.types';
import { SessionAuthServerServiceTag } from '../shared/session.service';

/**
 * Revoke a specific session via Better Auth server API.
 *
 * @pure
 * @description Wraps auth.api.revokeSession in an Effect, converting Promise-based
 * errors into typed SessionAuthServerApiError failures.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - The revoke session parameters
 * @returns Effect that resolves to revoke result or fails with SessionAuthServerApiError
 */
export const revokeSessionServerService: revokeSessionPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiRevokeSessionParamsFor<T>) =>
	Effect.flatMap(SessionAuthServerServiceTag, ({ authServer }) =>
		Effect.tryPromise({
			try: () => authServer.api.revokeSession(params),
			catch: mapBetterAuthApiErrorToSessionAuthError,
		})
	);
