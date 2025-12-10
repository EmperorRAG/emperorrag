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
import { AccountAuthServerServiceTag } from '../shared/account.service';

export const accountInfoServerController: accountInfoPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiAccountInfoParamsFor<T>) =>
	Effect.gen(function* () {
		const { authServer } = yield* AccountAuthServerServiceTag;
		const validatedParams = yield* validateInputEffect(
			createAccountInfoServerParamsSchema(authServer),
			params,
			isAuthServerApiAccountInfoParamsFor<T>,
			'accountInfo'
		);
		return yield* accountInfoServerService(validatedParams);
	});
