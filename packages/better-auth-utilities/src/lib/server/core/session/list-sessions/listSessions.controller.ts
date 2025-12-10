/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/list-sessions/listSessions.controller.ts
 * @description Controller for server-side list sessions operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createListSessionsServerParamsSchema } from './listSessions.schema';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiListSessionsParamsFor, type AuthServerApiListSessionsParamsFor, type listSessionsPropsFor } from './listSessions.types';
import { validateInputEffect } from '../../shared/core.error';
import { listSessionsServerService } from './listSessions.service';
import { SessionAuthServerServiceTag } from '../shared/session.service';

/**
 * Controller for list sessions operation with input validation.
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
 * @param params - The list sessions parameters to validate and process
 * @returns Effect requiring SessionAuthServerService context
 */
export const listSessionsServerController: listSessionsPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiListSessionsParamsFor<T>) =>
	Effect.gen(function* () {
		const { authServer } = yield* SessionAuthServerServiceTag;
		const validatedParams = yield* validateInputEffect(
			createListSessionsServerParamsSchema(authServer),
			params,
			isAuthServerApiListSessionsParamsFor<T>,
			'listSessions'
		);
		return yield* listSessionsServerService(validatedParams);
	});
