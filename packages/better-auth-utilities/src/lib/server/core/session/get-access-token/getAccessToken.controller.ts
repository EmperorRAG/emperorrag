/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/get-access-token/getAccessToken.controller.ts
 * @description Controller for server-side get access token operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createGetAccessTokenServerParamsSchema } from './getAccessToken.schema';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiGetAccessTokenParamsFor, type AuthServerApiGetAccessTokenParamsFor, type getAccessTokenPropsFor } from './getAccessToken.types';
import { validateInputEffect } from '../../shared/core.error';
import { getAccessTokenServerService } from './getAccessToken.service';
import { SessionAuthServerServiceTag } from '../shared/session.service';

/**
 * Controller for get access token operation with input validation.
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
 * @param params - The get access token parameters to validate and process
 * @returns Effect requiring SessionAuthServerService context
 */
export const getAccessTokenServerController: getAccessTokenPropsFor = <T extends AuthServerFor = AuthServerFor>(
	params: AuthServerApiGetAccessTokenParamsFor<T>
) =>
	Effect.gen(function* () {
		const { authServer } = yield* SessionAuthServerServiceTag;
		const validatedParams = yield* validateInputEffect(
			createGetAccessTokenServerParamsSchema(authServer),
			params,
			isAuthServerApiGetAccessTokenParamsFor<T>,
			'getAccessToken'
		);
		return yield* getAccessTokenServerService(validatedParams);
	});
