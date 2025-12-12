/**
 * @file libs/better-auth-utilities/src/lib/server/core/user/update-user/updateUser.controller.ts
 * @description Controller for server-side update user operation with validation.
 */

import * as Effect from 'effect/Effect';
import { PipelineContext } from '../../../../context/pipeline.context';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import { validateInputEffect } from '../../../../pipeline/zod-input-validator/zodInputValidator';
import { createAuthServerApiEndpointParamsSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import type { AuthServerFor } from '../../../server.types';
import { updateUserServerService } from './updateUser.service';
import { isAuthServerApiUpdateUserParamsFor, type AuthServerApiUpdateUserParamsFor, type updateUserPropsFor } from './updateUser.types';

export const updateUserServerController: updateUserPropsFor = (params: AuthServerApiUpdateUserParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		const validatedParams = yield* validateInputEffect(createAuthServerApiEndpointParamsSchema(), params, isAuthServerApiUpdateUserParamsFor);
		return yield* updateUserServerService(validatedParams);
	}).pipe(
		Effect.provideService(PipelineContext, {
			endpoint: AuthServerApiEndpoints.UpdateUser(),
		})
	);
