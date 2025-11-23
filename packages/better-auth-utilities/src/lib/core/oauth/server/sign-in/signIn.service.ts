/**
 * @file libs/better-auth-utilities/src/lib/core/oauth/server/sign-in/signIn.service.ts
 * @description Server-side service for social sign-in operation using Better Auth API.
 */

import { Effect } from 'effect';
import { APIError } from 'better-auth/api';
import type { SignInSocialServerProps } from './signIn.types.js';
import { OAuthAuthServerApiError } from '../shared/oauth.error.js';

/**
 * Sign in a user via social provider using Better Auth server API.
 *
 * @pure
 * @description Wraps auth.api.signInSocial in an Effect, converting Promise-based
 * errors into typed OAuthAuthServerApiError failures.
 *
 * @param deps - Dependencies bundle containing Better Auth server instance
 * @returns Curried function accepting params and returning an Effect
 */
export const signInSocialServer: SignInSocialServerProps = (deps) => (params) => {
	const { authServer } = deps;

	return Effect.tryPromise({
		try: () => authServer.api.signInSocial(params),
		catch: (error) => {
			if (error instanceof APIError) {
				const status = typeof error.status === 'number' ? error.status : parseInt(error.status as string, 10) || undefined;
				return new OAuthAuthServerApiError(error.message, status, error);
			}
			const message = error instanceof Error ? error.message : 'Sign in failed';
			return new OAuthAuthServerApiError(message, undefined, error);
		},
	});
};
