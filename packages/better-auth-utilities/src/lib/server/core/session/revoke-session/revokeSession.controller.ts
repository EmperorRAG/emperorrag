/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-session/revokeSession.controller.ts
 * @description Controller for server-side revoke session operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createBaseSchema, withBody, withOptionalHeaders, sessionTokenBodySchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import { pipe } from 'effect/Function';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiRevokeSessionParamsFor, type AuthServerApiRevokeSessionParamsFor, type revokeSessionPropsFor } from './revokeSession.types';
import { validateInputEffect } from '../../shared/core.error';
import { revokeSessionServerService } from './revokeSession.service';

/**
 * Controller for revoke session operation with input validation.
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
 * @param params - The revoke session parameters to validate and process
 * @returns Effect requiring AuthServerFor context
 */
export const revokeSessionServerController =
	<T extends AuthServerFor>(props: revokeSessionPropsFor<T>) =>
	(params: unknown): Effect.Effect<AuthServerApiRevokeSessionParamsFor<T>, Error> => {
		return validateInputEffect(
			Effect.succeed(pipe(createBaseSchema(), withBody(sessionTokenBodySchema), withOptionalHeaders())),
			params,
			isAuthServerApiRevokeSessionParamsFor(props)
		).pipe(Effect.flatMap((validParams) => revokeSessionServerService(props)(validParams)));
	};
