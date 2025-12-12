/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/verify-email/verifyEmail.service.ts
 * @description Server-side service for verify email operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import { AuthServerTag } from '../../../server.service';
import type { AuthServerFor } from '../../../server.types';
import { mapApiError } from '../../shared/core.error';
import type { AuthServerApiVerifyEmailParamsFor, verifyEmailPropsFor } from './verifyEmail.types';

/**
 * Verify user email via Better Auth server API.
 *
 * @pure
 * @description Wraps auth.api.verifyEmail in an Effect, converting Promise-based
 * errors into typed AuthServerApiError failures.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - The verify email parameters containing query token
 * @returns Effect that resolves to verification result or fails with AuthServerApiError
 */
export const verifyEmailServerService: verifyEmailPropsFor = (params: AuthServerApiVerifyEmailParamsFor<AuthServerFor>) =>
	Effect.flatMap(AuthServerTag, (authServer) =>
		Effect.tryPromise({
			try: () => authServer.api.verifyEmail(params),
			catch: mapApiError,
		})
	);
