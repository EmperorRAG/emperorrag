/**
 * @file libs/better-auth-utilities/src/lib/server/core/user/delete-user-callback/deleteUserCallback.controller.ts
 * @description Controller for server-side delete user callback operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createDeleteUserCallbackServerParamsSchema } from './deleteUserCallback.schema';
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
export const deleteUserCallbackServerController: deleteUserCallbackPropsFor = (
	params: AuthServerApiDeleteUserCallbackParamsFor<AuthServerFor>
) =>
	Effect.gen(function* () {
		const validatedParams = yield* validateInputEffect(
			createDeleteUserCallbackServerParamsSchema(),
			params,
			isAuthServerApiDeleteUserCallbackParamsFor,
			'deleteUserCallback'
		);
		return yield* deleteUserCallbackServerService(validatedParams);
	});
