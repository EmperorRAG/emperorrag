/**
 * @file libs/better-auth-utilities/src/lib/server/core/user/delete-user/deleteUser.controller.ts
 * @description Controller for server-side delete user operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createDeleteUserServerParamsSchema } from './deleteUser.schema';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiDeleteUserParamsFor, type AuthServerApiDeleteUserParamsFor, type deleteUserPropsFor } from './deleteUser.types';
import { validateInputEffect } from '../shared/user.error';
import { deleteUserServerService } from './deleteUser.service';
import { UserAuthServerServiceTag } from '../shared/user.service';

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
 * @returns Effect requiring UserAuthServerService context
 */
export const deleteUserServerController: deleteUserPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiDeleteUserParamsFor<T>) =>
	Effect.gen(function* () {
		const { authServer } = yield* UserAuthServerServiceTag;
		const validatedParams = yield* validateInputEffect(
			createDeleteUserServerParamsSchema(authServer),
			params,
			isAuthServerApiDeleteUserParamsFor<T>,
			'deleteUser'
		);
		return yield* deleteUserServerService(validatedParams);
	});
