/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/request-password-reset/requestPasswordReset.service.ts
 * @description Server-side service for request password reset operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerApiRequestPasswordResetParamsFor, requestPasswordResetPropsFor } from './requestPasswordReset.types';
import { mapBetterAuthApiErrorToEmailAuthError } from '../shared/email.error';
import type { AuthServerFor } from '../../../server.types';
import { EmailAuthServerServiceTag } from '../shared/email.service';

export const requestPasswordResetServerService: requestPasswordResetPropsFor = <T extends AuthServerFor = AuthServerFor>(
	params: AuthServerApiRequestPasswordResetParamsFor<T>
) =>
	Effect.flatMap(EmailAuthServerServiceTag, ({ authServer }) =>
		Effect.tryPromise({
			try: () => authServer.api.requestPasswordReset(params),
			catch: mapBetterAuthApiErrorToEmailAuthError,
		})
	);
