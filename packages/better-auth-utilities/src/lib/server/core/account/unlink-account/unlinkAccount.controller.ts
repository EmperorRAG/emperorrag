/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/unlink-account/unlinkAccount.controller.ts
 * @description Controller for server-side unlink account operation with validation.
 */

import * as Effect from 'effect/Effect';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import { validateInputEffect } from '../../../../pipeline/zod-input-validator/zodInputValidator';
import { createAuthServerApiEndpointParamsSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import type { AuthServerFor } from '../../../server.types';
import { unlinkAccountServerService } from './unlinkAccount.service';
import { isAuthServerApiUnlinkAccountParamsFor, type AuthServerApiUnlinkAccountParamsFor, type unlinkAccountPropsFor } from './unlinkAccount.types';

export const unlinkAccountServerController: unlinkAccountPropsFor = (params: AuthServerApiUnlinkAccountParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		const validatedParams = yield* validateInputEffect(
			createAuthServerApiEndpointParamsSchema(AuthServerApiEndpoints.unlinkAccount),
			params,
			isAuthServerApiUnlinkAccountParamsFor,
			'unlinkAccount'
		);
		return yield* unlinkAccountServerService(validatedParams);
	});
