/**
 * @file libs/better-auth-utilities/src/lib/core/user/server/update-user/updateUser.controller.ts
 * @description Server-side controller for update user operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createUpdateUserServerParamsSchema } from './updateUser.schema';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiUpdateUserParamsFor, type AuthServerApiUpdateUserParamsFor, type updateUserPropsFor } from './updateUser.types';
import { UserAuthServerInputError } from '../shared/user.error';
import { updateUserServerService } from './updateUser.service';
import { UserAuthServerServiceTag } from '../shared/user.service';

/**
 * Controller for update user operation with Zod validation and type narrowing.
 *
 * @pure
 * @description Validates input parameters using dynamic Zod schema, narrows types
 * using type guard, then delegates to the service layer. Provides comprehensive
 * input validation before executing the update operation.
 *
 * @remarks
 * **Validation Flow:**
 * 1. Access authServer from context via UserAuthServerServiceTag
 * 2. Create dynamic schema based on server configuration
 * 3. Validate input with Zod schema
 * 4. Narrow type with isAuthServerApiUpdateUserParamsFor guard
 * 5. Delegate to updateUserServerService
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - The update user parameters to validate and process
 * @returns Effect that resolves to updated user data or fails with validation/API error
 */
export const updateUserServerController: updateUserPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiUpdateUserParamsFor<T>) =>
	Effect.gen(function* (_) {
		const { authServer } = yield* _(UserAuthServerServiceTag);
		const schema = yield* _(createUpdateUserServerParamsSchema(authServer));

		// 1) Validate params input with Zod
		const parsed = schema.safeParse(params);

		if (!parsed.success) {
			const message = 'Invalid update user parameters';
			const cause = parsed.error;
			return yield* _(Effect.fail(new UserAuthServerInputError(message, cause)));
		}

		if (!isAuthServerApiUpdateUserParamsFor<T>(parsed.data)) {
			const message = 'Parsed data does not conform to expected update user parameters structure';
			return yield* _(Effect.fail(new UserAuthServerInputError(message)));
		}

		// 2) Call the service with the validated params
		const result = yield* _(updateUserServerService(parsed.data));

		// 3) Return the success value of the whole controller Effect
		return result;
	});
