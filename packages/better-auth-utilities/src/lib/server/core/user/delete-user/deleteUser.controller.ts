/**
 * @file libs/better-auth-utilities/src/lib/server/core/user/delete-user/deleteUser.controller.ts
 * @description Controller for server-side delete user operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createAuthSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiDeleteUserParamsFor, type AuthServerApiDeleteUserParamsFor, type deleteUserPropsFor } from './deleteUser.types';
import { validateInputEffect } from '../../shared/core.error';
import { deleteUserServerService } from './deleteUser.service';

export const deleteUserServerController: deleteUserPropsFor = (params: AuthServerApiDeleteUserParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		const validatedParams = yield* validateInputEffect(
			createAuthSchema(AuthServerApiEndpoints.deleteUser),
			params,
			isAuthServerApiDeleteUserParamsFor,
			'deleteUser'
		);
		return yield* deleteUserServerService(validatedParams);
	});
