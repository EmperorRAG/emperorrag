/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/verify-email/verifyEmail.service.ts
 * @description Server-side service for verify email operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import { APIError } from 'better-auth/api';
import type { AuthServerApiVerifyEmailParamsFor, verifyEmailPropsFor } from './verifyEmail.types';
import { EmailAuthServerApiError } from '../shared/email.error';
import type { AuthServerFor } from '../../../server.types';
import { EmailAuthServerServiceTag } from '../shared/email.service';

/**
 * Verify user email via Better Auth server API.
 *
 * @pure
 * @description Wraps auth.api.verifyEmail in an Effect, converting Promise-based
 * errors into typed EmailAuthServerApiError failures.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - The verify email parameters containing query token
 * @returns Effect that resolves to verification result or fails with EmailAuthServerApiError
 */
export const verifyEmailServerService: verifyEmailPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiVerifyEmailParamsFor<T>) =>
	Effect.flatMap(EmailAuthServerServiceTag, ({ authServer }) =>
		Effect.tryPromise({
			try: () => authServer.api.verifyEmail(params),
			catch: (error) => {
				if (error instanceof APIError) {
					const status = typeof error.status === 'number' ? error.status : parseInt(error.status as string, 10) || undefined;
					return new EmailAuthServerApiError(error.message, status, error);
				}
				const message = error instanceof Error ? error.message : 'Verify email failed';
				return new EmailAuthServerApiError(message, undefined, error);
			},
		})
	);
