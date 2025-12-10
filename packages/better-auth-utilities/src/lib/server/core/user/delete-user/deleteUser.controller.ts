/**
 * @file libs/better-auth-utilities/src/lib/server/core/user/delete-user/deleteUser.controller.ts
 * @description Controller for server-side delete user operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createBaseSchema, withBody, withOptionalHeaders } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import { pipe } from 'effect/Function';
import { z } from 'zod';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiDeleteUserParamsFor, type AuthServerApiDeleteUserParamsFor, type deleteUserPropsFor } from './deleteUser.types';
import { validateInputEffect } from '../../shared/core.error';
import { deleteUserServerService } from './deleteUser.service';

/**
 * Controller for delete user operation with input validation.
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
 * @param params - The delete user parameters to validate and process
 * @returns Effect requiring AuthServerFor context
 */
export const deleteUserServerController =
	<T extends AuthServerFor>(props: deleteUserPropsFor<T>) =>
	(params: unknown): Effect.Effect<AuthServerApiDeleteUserParamsFor<T>, Error> => {
		return validateInputEffect(
			Effect.succeed(pipe(createBaseSchema(), withBody(z.object({ callbackURL: z.string().optional() })), withOptionalHeaders())),
			params,
			isAuthServerApiDeleteUserParamsFor(props)
		).pipe(Effect.flatMap((validParams) => deleteUserServerService(props)(validParams)));
	};
