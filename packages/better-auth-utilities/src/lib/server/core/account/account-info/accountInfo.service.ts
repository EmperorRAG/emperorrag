/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/account-info/accountInfo.service.ts
 * @description Server-side service for account info operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import { mapApiError } from '../../../../errors/authServer.error';
import { AuthServerTag } from '../../../server.service';
import type { AuthServerFor } from '../../../server.types';
import type { AuthServerApiAccountInfoParamsFor, accountInfoPropsFor } from './accountInfo.types';

export const accountInfoServerService: accountInfoPropsFor = (params: AuthServerApiAccountInfoParamsFor<AuthServerFor>) =>
	Effect.flatMap(AuthServerTag, (authServer) =>
		Effect.tryPromise({
			try: () => authServer.api.accountInfo(params),
			catch: mapApiError,
		})
	);
