/**
 * @file libs/better-auth-utilities/src/lib/server/core/user/delete-user-callback/deleteUserCallback.controller.ts
 * @description Controller for server-side delete user callback operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createAuthSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import type { AuthServerFor } from '../../../server.types';
import {
	isAuthServerApiDeleteUserCallbackParamsFor,
	type AuthServerApiDeleteUserCallbackParamsFor,
	type deleteUserCallbackPropsFor,
} from './deleteUserCallback.types';
import { validateInputEffect } from '../../shared/core.error';
import { deleteUserCallbackServerService } from './deleteUserCallback.service';

export const deleteUserCallbackServerController: deleteUserCallbackPropsFor = (params: AuthServerApiDeleteUserCallbackParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		const validatedParams = yield* validateInputEffect(
			createAuthSchema(AuthServerApiEndpoints.deleteUserCallback),
			params,
			isAuthServerApiDeleteUserCallbackParamsFor,
			'deleteUserCallback'
		);
		return yield* deleteUserCallbackServerService(validatedParams);
	});
