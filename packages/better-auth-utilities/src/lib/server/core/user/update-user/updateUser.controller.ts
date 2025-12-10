/**
 * @file libs/better-auth-utilities/src/lib/server/core/user/update-user/updateUser.controller.ts
 * @description Controller for server-side update user operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createAuthSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import { z } from 'zod';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiUpdateUserParamsFor, type AuthServerApiUpdateUserParamsFor, type updateUserPropsFor } from './updateUser.types';
import { validateInputEffect } from '../../shared/core.error';
import { updateUserServerService } from './updateUser.service';

export const updateUserServerController: updateUserPropsFor = (params: AuthServerApiUpdateUserParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		const validatedParams = yield* validateInputEffect(
			createAuthSchema({
				body: z.object({
					name: z.string().optional(),
					image: z.string().optional(),
					firstName: z.string().optional(),
					lastName: z.string().optional(),
				}),
				headers: 'optional',
			}),
			params,
			isAuthServerApiUpdateUserParamsFor,
			'updateUser'
		);
		return yield* updateUserServerService(validatedParams);
	});
