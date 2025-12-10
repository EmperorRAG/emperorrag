/**
 * @file libs/better-auth-utilities/src/lib/server/core/user/update-user/updateUser.controller.ts
 * @description Controller for server-side update user operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createUpdateUserServerParamsSchema } from './updateUser.schema';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiUpdateUserParamsFor, type AuthServerApiUpdateUserParamsFor, type updateUserPropsFor } from './updateUser.types';
import { validateInputEffect } from '../shared/user.error';
import { updateUserServerService } from './updateUser.service';
import { UserAuthServerServiceTag } from '../shared/user.service';

/**
 * Controller for update user operation with input validation.
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
 * @param params - The update user parameters to validate and process
 * @returns Effect requiring UserAuthServerService context
 */
export const updateUserServerController: updateUserPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiUpdateUserParamsFor<T>) =>
	Effect.gen(function* () {
		const { authServer } = yield* UserAuthServerServiceTag;
		const validatedParams = yield* validateInputEffect(
			createUpdateUserServerParamsSchema(authServer),
			params,
			isAuthServerApiUpdateUserParamsFor<T>,
			'updateUser'
		);
		return yield* updateUserServerService(validatedParams);
	});
