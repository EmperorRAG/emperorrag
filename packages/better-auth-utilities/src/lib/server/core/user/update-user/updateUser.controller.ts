/**
 * @file libs/better-auth-utilities/src/lib/server/core/user/update-user/updateUser.controller.ts
 * @description Controller for server-side update user operation with validation.
 */

import * as Effect from 'effect/Effect';
import { validateInputEffect } from 'packages/better-auth-utilities/src/lib/pipeline/zod-input-validator/zodInputValidator';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import { createAuthServerApiEndpointParamsSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import type { AuthServerFor } from '../../../server.types';
import { updateUserServerService } from './updateUser.service';
import { isAuthServerApiUpdateUserParamsFor, type AuthServerApiUpdateUserParamsFor, type updateUserPropsFor } from './updateUser.types';

export const updateUserServerController: updateUserPropsFor = (params: AuthServerApiUpdateUserParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		const validatedParams = yield* validateInputEffect(
			createAuthServerApiEndpointParamsSchema(AuthServerApiEndpoints.updateUser),
			params,
			isAuthServerApiUpdateUserParamsFor,
			'updateUser'
		);
		return yield* updateUserServerService(validatedParams);
	});
