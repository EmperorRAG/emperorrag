/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/account-info/accountInfo.controller.ts
 * @description Server-side controller for account info operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createAuthSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiAccountInfoParamsFor, type AuthServerApiAccountInfoParamsFor, type accountInfoPropsFor } from './accountInfo.types';
import { validateInputEffect } from '../../shared/core.error';
import { accountInfoServerService } from './accountInfo.service';

export const accountInfoServerController: accountInfoPropsFor = (params: AuthServerApiAccountInfoParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		const validatedParams = yield* validateInputEffect(
			createAuthSchema({ headers: 'optional' }),
			params,
			isAuthServerApiAccountInfoParamsFor,
			'accountInfo'
		);
		return yield* accountInfoServerService(validatedParams);
	});
