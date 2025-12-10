/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-sessions/revokeSessions.controller.ts
 * @description Controller for server-side revoke all sessions operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createRevokeSessionsServerParamsSchema } from './revokeSessions.schema';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiRevokeSessionsParamsFor, type AuthServerApiRevokeSessionsParamsFor, type revokeSessionsPropsFor } from './revokeSessions.types';
import { validateInputEffect } from '../../shared/core.error';
import { revokeSessionsServerService } from './revokeSessions.service';
import { SessionAuthServerServiceTag } from '../shared/session.service';

/**
 * Controller for revoke all sessions operation with input validation.
 *
 * @pure
 * @description Validates input parameters using dynamically generated Zod schema,
 * then delegates to the service layer. Uses validateInputEffect for composable
 * error tracing through schema creation, parsing, and type guard validation.
 *
 * @remarks
 * **Validation Flow:**
 * 1. Retrieve authServer from Effect context
 * 2. Create schema via Effect pipeline
 * 3. Parse and validate with type guard
 * 4. Call service with validated params
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - The revoke sessions parameters to validate and process
 * @returns Effect requiring SessionAuthServerService context
 */
export const revokeSessionsServerController: revokeSessionsPropsFor = <T extends AuthServerFor = AuthServerFor>(
	params: AuthServerApiRevokeSessionsParamsFor<T>
) =>
	Effect.gen(function* () {
		const { authServer } = yield* SessionAuthServerServiceTag;
		const validatedParams = yield* validateInputEffect(
			createRevokeSessionsServerParamsSchema(authServer),
			params,
			isAuthServerApiRevokeSessionsParamsFor<T>,
			'revokeSessions'
		);
		return yield* revokeSessionsServerService(validatedParams);
	});
