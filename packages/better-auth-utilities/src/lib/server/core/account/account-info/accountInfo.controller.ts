/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/account-info/accountInfo.controller.ts
 * @description Server-side controller for account info operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createAccountInfoServerParamsSchema } from './accountInfo.schema';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiAccountInfoParamsFor, type AuthServerApiAccountInfoParamsFor, type accountInfoPropsFor } from './accountInfo.types';
import { AccountAuthServerInputError } from '../shared/account.error';
import { accountInfoServerService } from './accountInfo.service';
import { AccountAuthServerServiceTag } from '../shared/account.service';

export const accountInfoServerController: accountInfoPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiAccountInfoParamsFor<T>) =>
	Effect.gen(function* (_) {
		const { authServer } = yield* _(AccountAuthServerServiceTag);
		const schema = yield* _(createAccountInfoServerParamsSchema(authServer));

		const parsed = schema.safeParse(params);

		if (!parsed.success) {
			const message = 'Invalid account info parameters';
			const cause = parsed.error;
			return yield* _(Effect.fail(new AccountAuthServerInputError(message, cause)));
		}

		if (!isAuthServerApiAccountInfoParamsFor<T>(parsed.data)) {
			const message = 'Parsed data does not conform to expected account info parameters structure';
			return yield* _(Effect.fail(new AccountAuthServerInputError(message)));
		}

		const result = yield* _(accountInfoServerService(parsed.data));

		return result;
	});
