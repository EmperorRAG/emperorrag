/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-session/revokeSession.service.ts
 * @description Server-side service for revoke session operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import { mapApiError } from '../../../../errors/authServer.error';
import { AuthServerTag } from '../../../server.service';
import type { AuthServerFor } from '../../../server.types';
import type { AuthServerApiRevokeSessionParamsFor, revokeSessionPropsFor } from './revokeSession.types';

/**
 * Revoke a specific session via Better Auth server API.
 *
 * @pure
 * @description Wraps auth.api.revokeSession in an Effect, converting Promise-based
 * errors into typed AuthServerApiError failures.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - The revoke session parameters
 * @returns Effect that resolves to revoke result or fails with AuthServerApiError
 */
export const revokeSessionServerService: revokeSessionPropsFor = (params: AuthServerApiRevokeSessionParamsFor<AuthServerFor>) =>
	Effect.flatMap(AuthServerTag, (authServer) =>
		Effect.tryPromise({
			try: () => authServer.api.revokeSession(params),
			catch: mapApiError,
		})
	);
