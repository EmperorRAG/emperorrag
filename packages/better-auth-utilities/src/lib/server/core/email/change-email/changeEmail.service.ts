/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/change-email/changeEmail.service.ts
 * @description Server-side service for change email operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerApiChangeEmailParamsFor, changeEmailPropsFor } from './changeEmail.types';
import { mapBetterAuthApiErrorToEmailAuthError } from '../shared/email.error';
import type { AuthServerFor } from '../../../server.types';
import { EmailAuthServerServiceTag } from '../shared/email.service';

/**
 * Change user email via Better Auth server API.
 *
 * @pure
 * @description Wraps auth.api.changeEmail in an Effect, converting Promise-based
 * errors into typed EmailAuthServerApiError failures.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - The change email parameters containing body with newEmail
 * @returns Effect that resolves to change email result or fails with EmailAuthServerApiError
 */
export const changeEmailServerService: changeEmailPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiChangeEmailParamsFor<T>) =>
	Effect.flatMap(EmailAuthServerServiceTag, ({ authServer }) =>
		Effect.tryPromise({
			try: () => authServer.api.changeEmail(params),
			catch: mapBetterAuthApiErrorToEmailAuthError,
		})
	);
