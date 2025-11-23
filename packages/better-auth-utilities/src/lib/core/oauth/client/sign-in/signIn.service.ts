import { Effect } from 'effect';
import { OAuthAuthApiError } from '../shared/oauth.error.js';
import type { SignInSocialProps } from './signIn.types.js';

/**
 * Initiates a social sign-in flow.
 *
 * @pure
 * @description Wraps the Better Auth `signIn.social` API call in an Effect.
 *
 * @param deps - Dependencies bundle containing the Better Auth client
 * @returns Curried function accepting input and returning an Effect
 */
export const signInSocial: SignInSocialProps = (deps) => (input) => {
	const { authClient } = deps;

	return Effect.tryPromise({
		try: async () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const result = await (authClient.signIn.social as any)(input);
			if (result?.error) {
				throw result.error;
			}
			return result;
		},
		catch: (error) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const message = (error as any)?.message || (error instanceof Error ? error.message : 'Social sign-in failed');
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const status = error && typeof error === 'object' && 'status' in error ? ((error as any).status as number) : undefined;
			return new OAuthAuthApiError(message, status, error);
		},
	});
};
