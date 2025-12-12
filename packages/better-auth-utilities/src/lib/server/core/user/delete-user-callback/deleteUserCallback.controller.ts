/**
 * @file libs/better-auth-utilities/src/lib/server/core/user/delete-user-callback/deleteUserCallback.controller.ts
 * @description Controller for server-side delete user callback operation with validation.
 */

import * as Effect from 'effect/Effect';
import { PipelineContext } from '../../../../context/pipeline.context';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import { validateInputEffect } from '../../../../pipeline/zod-input-validator/zodInputValidator';
import { createAuthServerApiEndpointParamsSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import type { AuthServerFor } from '../../../server.types';
import { deleteUserCallbackServerService } from './deleteUserCallback.service';
import {
	isAuthServerApiDeleteUserCallbackParamsFor,
	type AuthServerApiDeleteUserCallbackParamsFor,
	type deleteUserCallbackPropsFor,
} from './deleteUserCallback.types';

export const deleteUserCallbackServerController: deleteUserCallbackPropsFor = (params: AuthServerApiDeleteUserCallbackParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		const validatedParams = yield* validateInputEffect(createAuthServerApiEndpointParamsSchema(), params, isAuthServerApiDeleteUserCallbackParamsFor);
		return yield* deleteUserCallbackServerService(validatedParams);
	}).pipe(
		Effect.provideService(PipelineContext, {
			endpoint: AuthServerApiEndpoints.DeleteUserCallback(),
		})
	);
