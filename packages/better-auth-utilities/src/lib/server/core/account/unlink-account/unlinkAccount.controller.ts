/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/unlink-account/unlinkAccount.controller.ts
 * @description Controller for server-side unlink account operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createAuthSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiUnlinkAccountParamsFor, type AuthServerApiUnlinkAccountParamsFor, type unlinkAccountPropsFor } from './unlinkAccount.types';
import { validateInputEffect } from '../../shared/core.error';
import { unlinkAccountServerService } from './unlinkAccount.service';

export const unlinkAccountServerController: unlinkAccountPropsFor = (params: AuthServerApiUnlinkAccountParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		const validatedParams = yield* validateInputEffect(
			createAuthSchema(AuthServerApiEndpoints.unlinkAccount),
			params,
			isAuthServerApiUnlinkAccountParamsFor,
			'unlinkAccount'
		);
		return yield* unlinkAccountServerService(validatedParams);
	});
