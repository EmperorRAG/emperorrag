/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-other-sessions/revokeOtherSessions.controller.ts
 * @description Controller for server-side revoke other sessions operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createRevokeOtherSessionsServerParamsSchema } from './revokeOtherSessions.schema';
import type { AuthServerFor } from '../../../server.types';
import {
	isAuthServerApiRevokeOtherSessionsParamsFor,
	type AuthServerApiRevokeOtherSessionsParamsFor,
	type revokeOtherSessionsPropsFor,
} from './revokeOtherSessions.types';
import { validateInputEffect } from '../shared/session.error';
import { revokeOtherSessionsServerService } from './revokeOtherSessions.service';
import { SessionAuthServerServiceTag } from '../shared/session.service';

/**
 * Controller for revoke other sessions operation with input validation.
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
 * @param params - The revoke other sessions parameters to validate and process
 * @returns Effect requiring SessionAuthServerService context
 */
export const revokeOtherSessionsServerController: revokeOtherSessionsPropsFor = <T extends AuthServerFor = AuthServerFor>(
	params: AuthServerApiRevokeOtherSessionsParamsFor<T>
) =>
	Effect.gen(function* () {
		const { authServer } = yield* SessionAuthServerServiceTag;
		const validatedParams = yield* validateInputEffect(
			createRevokeOtherSessionsServerParamsSchema(authServer),
			params,
			isAuthServerApiRevokeOtherSessionsParamsFor<T>,
			'revokeOtherSessions'
		);
		return yield* revokeOtherSessionsServerService(validatedParams);
	});
