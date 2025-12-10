/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/get-access-token/getAccessToken.controller.ts
 * @description Controller for server-side get access token operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createBaseSchema, withOptionalHeaders } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import { pipe } from 'effect/Function';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiGetAccessTokenParamsFor, type AuthServerApiGetAccessTokenParamsFor, type getAccessTokenPropsFor } from './getAccessToken.types';
import { validateInputEffect } from '../../shared/core.error';
import { getAccessTokenServerService } from './getAccessToken.service';

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
 * @returns Effect requiring AuthServerFor context
 */
export const getAccessTokenServerController =
	<T extends AuthServerFor>(props: getAccessTokenPropsFor<T>) =>
	(params: unknown): Effect.Effect<AuthServerApiGetAccessTokenParamsFor<T>, Error> => {
		return validateInputEffect(Effect.succeed(pipe(createBaseSchema(), withOptionalHeaders())), params, isAuthServerApiGetAccessTokenParamsFor(props)).pipe(
			Effect.flatMap((validParams) => getAccessTokenServerService(props)(validParams))
		);
	};
