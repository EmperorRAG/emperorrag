/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/account-info/accountInfo.service.ts
 * @description Server-side service for account info operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import { APIError } from 'better-auth/api';
import type { AuthServerApiAccountInfoParamsFor, accountInfoPropsFor } from './accountInfo.types';
import { AccountAuthServerApiError } from '../shared/account.error';
import type { AuthServerFor } from '../../../server.types';
import { AccountAuthServerServiceTag } from '../shared/account.service';

export const accountInfoServerService: accountInfoPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiAccountInfoParamsFor<T>) =>
	Effect.flatMap(AccountAuthServerServiceTag, ({ authServer }) =>
		Effect.tryPromise({
			try: () => authServer.api.accountInfo(params),
			catch: (error) => {
				if (error instanceof APIError) {
					const status = typeof error.status === 'number' ? error.status : parseInt(error.status as string, 10) || undefined;
					return new AccountAuthServerApiError(error.message, status, error);
				}
				const message = error instanceof Error ? error.message : 'Account info failed';
				return new AccountAuthServerApiError(message, undefined, error);
			},
		})
	);
