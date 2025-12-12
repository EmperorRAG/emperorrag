/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/request-password-reset/requestPasswordReset.service.ts
 * @description Server-side service for request password reset operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import { mapApiError } from '../../../../pipeline/map-api-error/mapApiError';
import { AuthServerTag } from '../../../server.service';
import type { AuthServerFor } from '../../../server.types';
import type { AuthServerApiRequestPasswordResetParamsFor, requestPasswordResetPropsFor } from './requestPasswordReset.types';

export const requestPasswordResetServerService: requestPasswordResetPropsFor = (params: AuthServerApiRequestPasswordResetParamsFor<AuthServerFor>) =>
	Effect.flatMap(AuthServerTag, (authServer) =>
		Effect.tryPromise({
			try: () => authServer.api.requestPasswordReset(params),
			catch: mapApiError,
		})
	);
