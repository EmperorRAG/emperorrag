/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/account-info/accountInfo.controller.ts
 * @description Server-side controller for account info operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createAccountInfoServerParamsSchema } from './accountInfo.schema';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiAccountInfoParamsFor, type AuthServerApiAccountInfoParamsFor, type accountInfoPropsFor } from './accountInfo.types';
import { validateInputEffect } from '../../shared/core.error';
import { accountInfoServerService } from './accountInfo.service';
import { AuthServerTag } from '../../../server.service';

export const accountInfoServerController: accountInfoPropsFor = (params: AuthServerApiAccountInfoParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		const authServer = yield* AuthServerTag;
		const validatedParams = yield* validateInputEffect(
			createAccountInfoServerParamsSchema(),
			params,
			isAuthServerApiAccountInfoParamsFor,
			'accountInfo'
		);
		return yield* accountInfoServerService(validatedParams).pipe(Effect.provideService(AuthServerTag, authServer));
	});
