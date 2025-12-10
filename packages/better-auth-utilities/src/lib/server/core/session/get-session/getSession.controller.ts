/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/get-session/getSession.controller.ts
 * @description Controller for server-side get session operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createBaseSchema, withOptionalHeaders } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import { pipe } from 'effect/Function';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiGetSessionParamsFor, type AuthServerApiGetSessionParamsFor, type getSessionPropsFor } from './getSession.types';
import { validateInputEffect } from '../../shared/core.error';
import { getSessionServerService } from './getSession.service';

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
export const getSessionServerController =
	<T extends AuthServerFor>(props: getSessionPropsFor<T>) =>
	(params: unknown): Effect.Effect<AuthServerApiGetSessionParamsFor<T>, Error> => {
		return validateInputEffect(Effect.succeed(pipe(createBaseSchema(), withOptionalHeaders())), params, isAuthServerApiGetSessionParamsFor(props)).pipe(
			Effect.flatMap((validParams) => getSessionServerService(props)(validParams))
		);
	};
