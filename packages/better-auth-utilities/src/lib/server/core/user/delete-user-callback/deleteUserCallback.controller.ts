/**
 * @file libs/better-auth-utilities/src/lib/server/core/user/delete-user-callback/deleteUserCallback.controller.ts
 * @description Server-side controller for delete user callback operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createDeleteUserCallbackServerParamsSchema } from './deleteUserCallback.schema';
import type { AuthServerFor } from '../../../server.types';
import {
	isAuthServerApiDeleteUserCallbackParamsFor,
	type AuthServerApiDeleteUserCallbackParamsFor,
	type deleteUserCallbackPropsFor,
} from './deleteUserCallback.types';
import { UserAuthServerInputError } from '../shared/user.error';
import { deleteUserCallbackServerService } from './deleteUserCallback.service';
import { UserAuthServerServiceTag } from '../shared/user.service';

export const deleteUserCallbackServerController: deleteUserCallbackPropsFor = <T extends AuthServerFor = AuthServerFor>(
	params: AuthServerApiDeleteUserCallbackParamsFor<T>
) =>
	Effect.gen(function* (_) {
		const { authServer } = yield* _(UserAuthServerServiceTag);
		const schema = yield* _(createDeleteUserCallbackServerParamsSchema(authServer));

		const parsed = schema.safeParse(params);

		if (!parsed.success) {
			const message = 'Invalid delete user callback parameters';
			const cause = parsed.error;
			return yield* _(Effect.fail(new UserAuthServerInputError(message, cause)));
		}

		if (!isAuthServerApiDeleteUserCallbackParamsFor<T>(parsed.data)) {
			const message = 'Parsed data does not conform to expected delete user callback parameters structure';
			return yield* _(Effect.fail(new UserAuthServerInputError(message)));
		}

		const result = yield* _(deleteUserCallbackServerService(parsed.data));

		return result;
	});
