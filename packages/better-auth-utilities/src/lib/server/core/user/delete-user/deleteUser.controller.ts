/**
 * @file libs/better-auth-utilities/src/lib/server/core/user/delete-user/deleteUser.controller.ts
 * @description Server-side controller for delete user operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createDeleteUserServerParamsSchema } from './deleteUser.schema';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiDeleteUserParamsFor, type AuthServerApiDeleteUserParamsFor, type deleteUserPropsFor } from './deleteUser.types';
import { UserAuthServerInputError } from '../shared/user.error';
import { deleteUserServerService } from './deleteUser.service';
import { UserAuthServerServiceTag } from '../shared/user.service';

/**
 * Controller for delete user operation with Zod validation and type narrowing.
 *
 * @pure
 * @description Validates input parameters using dynamic Zod schema, narrows types
 * using type guard, then delegates to the service layer.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - The delete user parameters to validate and process
 * @returns Effect that resolves to delete user result or fails with validation/API error
 */
export const deleteUserServerController: deleteUserPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiDeleteUserParamsFor<T>) =>
	Effect.gen(function* (_) {
		const { authServer } = yield* _(UserAuthServerServiceTag);
		const schema = yield* _(createDeleteUserServerParamsSchema(authServer));

		const parsed = schema.safeParse(params);

		if (!parsed.success) {
			const message = 'Invalid delete user parameters';
			const cause = parsed.error;
			return yield* _(Effect.fail(new UserAuthServerInputError(message, cause)));
		}

		if (!isAuthServerApiDeleteUserParamsFor<T>(parsed.data)) {
			const message = 'Parsed data does not conform to expected delete user parameters structure';
			return yield* _(Effect.fail(new UserAuthServerInputError(message)));
		}

		const result = yield* _(deleteUserServerService(parsed.data));

		return result;
	});
