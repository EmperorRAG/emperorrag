/**
 * @file libs/better-auth-utilities/src/lib/server/core/user/delete-user-callback/deleteUserCallback.controller.ts
 * @description Controller for server-side delete user callback operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createBaseSchema, withQuery, withOptionalHeaders } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import { pipe } from 'effect/Function';
import { z } from 'zod';
import type { AuthServerFor } from '../../../server.types';
import {
	isAuthServerApiDeleteUserCallbackParamsFor,
	type AuthServerApiDeleteUserCallbackParamsFor,
	type deleteUserCallbackPropsFor,
} from './deleteUserCallback.types';
import { validateInputEffect } from '../../shared/core.error';
import { deleteUserCallbackServerService } from './deleteUserCallback.service';

/**
 * Controller for delete user callback operation with input validation.
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
 * @param params - The delete user callback parameters to validate and process
 * @returns Effect requiring AuthServerFor context
 */
export const deleteUserCallbackServerController =
	<T extends AuthServerFor>(props: deleteUserCallbackPropsFor<T>) =>
	(params: unknown): Effect.Effect<AuthServerApiDeleteUserCallbackParamsFor<T>, Error> => {
		return validateInputEffect(
			Effect.succeed(pipe(createBaseSchema(), withQuery(z.object({ token: z.string() })), withOptionalHeaders())),
			params,
			isAuthServerApiDeleteUserCallbackParamsFor(props)
		).pipe(Effect.flatMap((validParams) => deleteUserCallbackServerService(props)(validParams)));
	};
