/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/refresh-token/refreshToken.controller.ts
 * @description Controller for server-side refresh token operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createBaseSchema, withOptionalHeaders } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import { pipe } from 'effect/Function';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiRefreshTokenParamsFor, type AuthServerApiRefreshTokenParamsFor, type refreshTokenPropsFor } from './refreshToken.types';
import { validateInputEffect } from '../../shared/core.error';
import { refreshTokenServerService } from './refreshToken.service';

/**
 * Controller for refresh token operation with input validation.
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
 * @param params - The refresh token parameters to validate and process
 * @returns Effect requiring AuthServerFor context
 */
export const refreshTokenServerController =
	<T extends AuthServerFor>(props: refreshTokenPropsFor<T>) =>
	(params: unknown): Effect.Effect<AuthServerApiRefreshTokenParamsFor<T>, Error> => {
		return validateInputEffect(Effect.succeed(pipe(createBaseSchema(), withOptionalHeaders())), params, isAuthServerApiRefreshTokenParamsFor(props)).pipe(
			Effect.flatMap((validParams) => refreshTokenServerService(props)(validParams))
		);
	};
