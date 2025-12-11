/**
 * @file libs/better-auth-utilities/src/lib/server/core/user/update-user/updateUser.controller.ts
 * @description Controller for server-side update user operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createAuthSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiUpdateUserParamsFor, type AuthServerApiUpdateUserParamsFor, type updateUserPropsFor } from './updateUser.types';
import { validateInputEffect } from '../../shared/core.error';
import { updateUserServerService } from './updateUser.service';

export const updateUserServerController: updateUserPropsFor = (params: AuthServerApiUpdateUserParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		const validatedParams = yield* validateInputEffect(
			createAuthSchema(AuthServerApiEndpoints.updateUser),
			params,
			isAuthServerApiUpdateUserParamsFor,
			'updateUser'
		);
		return yield* updateUserServerService(validatedParams);
	});
