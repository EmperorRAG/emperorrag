/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/get-session/getSession.controller.ts
 * @description Controller for server-side get session operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createGetSessionServerParamsSchema } from './getSession.schema';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiGetSessionParamsFor, type AuthServerApiGetSessionParamsFor, type getSessionPropsFor } from './getSession.types';
import { validateInputEffect } from '../../shared/core.error';
import { getSessionServerService } from './getSession.service';
import { AuthServerTag } from '../../../server.service';

/**
 * Controller for get session operation with input validation.
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
 * @param params - The get session parameters to validate and process
 * @returns Effect requiring AuthServerTag context
 */
export const getSessionServerController: getSessionPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiGetSessionParamsFor<T>) =>
	Effect.gen(function* () {
		const authServer = yield* AuthServerTag;
		const validatedParams = yield* validateInputEffect(
			createGetSessionServerParamsSchema(authServer),
			params,
			isAuthServerApiGetSessionParamsFor<T>,
			'getSession'
		);
		return yield* getSessionServerService(validatedParams);
	});
