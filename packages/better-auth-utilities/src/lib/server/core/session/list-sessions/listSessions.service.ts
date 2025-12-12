/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/list-sessions/listSessions.service.ts
 * @description Server-side service for list sessions operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import { AuthServerTag } from '../../../server.service';
import type { AuthServerFor } from '../../../server.types';
import { mapApiError } from '../../shared/core.error';
import type { AuthServerApiListSessionsParamsFor, listSessionsPropsFor } from './listSessions.types';

/**
 * List all sessions for authenticated user via Better Auth server API.
 *
 * @pure
 * @description Wraps auth.api.listSessions in an Effect, converting Promise-based
 * errors into typed AuthServerApiError failures.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - The list sessions parameters
 * @returns Effect that resolves to list of sessions or fails with AuthServerApiError
 */
export const listSessionsServerService: listSessionsPropsFor = (params: AuthServerApiListSessionsParamsFor<AuthServerFor>) =>
	Effect.flatMap(AuthServerTag, (authServer) =>
		Effect.tryPromise({
			try: () => authServer.api.listSessions(params),
			catch: mapApiError,
		})
	);
