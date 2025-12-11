/**
 * @file libs/better-auth-utilities/src/lib/server/core/user/delete-user/deleteUser.controller.ts
 * @description Controller for server-side delete user operation with validation.
 */

import * as Effect from 'effect/Effect';
import { validateInputEffect } from '../../../../pipeline/zod-input-validator/zodInputValidator';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import { createAuthServerApiEndpointParamsSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import type { AuthServerFor } from '../../../server.types';
import { deleteUserServerService } from './deleteUser.service';
import { isAuthServerApiDeleteUserParamsFor, type AuthServerApiDeleteUserParamsFor, type deleteUserPropsFor } from './deleteUser.types';

export const deleteUserServerController: deleteUserPropsFor = (params: AuthServerApiDeleteUserParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		const validatedParams = yield* validateInputEffect(
			createAuthServerApiEndpointParamsSchema(AuthServerApiEndpoints.deleteUser),
			params,
			isAuthServerApiDeleteUserParamsFor,
			'deleteUser'
		);
		return yield* deleteUserServerService(validatedParams);
	});
