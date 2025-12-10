/**
 * @file libs/better-auth-utilities/src/lib/server/core/user/update-user/updateUser.controller.ts
 * @description Controller for server-side update user operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createBaseSchema, withBody, withOptionalHeaders } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import { pipe } from 'effect/Function';
import { z } from 'zod';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiUpdateUserParamsFor, type AuthServerApiUpdateUserParamsFor, type updateUserPropsFor } from './updateUser.types';
import { validateInputEffect } from '../../shared/core.error';
import { updateUserServerService } from './updateUser.service';

/**
 * Controller for update user operation with input validation.
 *
 * @pure
 * @description Validates input parameters using dynamically generated Zod schema,
 * then delegates to the service layer. Uses validateInputEffect for composable
 * error tracing through schema creation, parsing, and type guard validation.
 *
 * @remarks
 * **Validation Flow:**
 * 1. Retrieve authServer from Effect context
 * 2. Create schema via Effect pipeline
 * 3. Parse and validate with type guard
 * 4. Call service with validated params
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - The update user parameters to validate and process
 * @returns Effect requiring AuthServerFor context
 */
export const updateUserServerController =
	<T extends AuthServerFor>(props: updateUserPropsFor<T>) =>
	(params: unknown): Effect.Effect<AuthServerApiUpdateUserParamsFor<T>, Error> => {
		return validateInputEffect(
			Effect.succeed(
				pipe(
					createBaseSchema(),
					withBody(
						z.object({
							name: z.string().optional(),
							image: z.string().optional(),
							firstName: z.string().optional(),
							lastName: z.string().optional(),
						})
					),
					withOptionalHeaders()
				)
			),
			params,
			isAuthServerApiUpdateUserParamsFor(props)
		).pipe(Effect.flatMap((validParams) => updateUserServerService(props)(validParams)));
	};
