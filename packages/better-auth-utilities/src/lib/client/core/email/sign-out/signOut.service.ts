import * as Effect from 'effect/Effect';
import type { signOutProps } from './signOut.types';
import { EmailAuthApiError } from '../shared/email.error';

/**
 * Sign out the currently authenticated user using Better Auth.
 *
 * @pure
 * @description Wraps the Better Auth `signOut` API call in an Effect, converting Promise-based
 * errors into typed `EmailAuthApiError` failures in the error channel.
 *
 * @fp-pattern Dependency injection + Promise-to-Effect conversion
 * @composition
 *   - Curried function accepting dependencies first, then input
 *   - `Effect.tryPromise` converts Better Auth Promise to Effect with typed error channel
 *   - Error mapping extracts status code and message from Better Auth API errors
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { signOut } from './signOut.service';
 *
 * const program = Effect.gen(function* () {
 *   const result = yield* signOut({ authClient })({
 *     callbackURL: '/login'
 *   });
 *
 *   console.log('Signed out successfully');
 *   return result;
 * });
 * ```
 *
 * @param deps - Dependencies bundle containing the Better Auth client
 * @returns Curried function accepting sign-out input and returning an Effect
 */
export const signOutClient: signOutProps = (deps) => (input) => {
	const { authClient } = deps;

	return Effect.tryPromise({
		try: () => authClient.signOut(input),
		catch: (error) => {
			const message = error instanceof Error ? error.message : 'Sign out failed';
			const status = error && typeof error === 'object' && 'status' in error ? (error.status as number) : undefined;
			return new EmailAuthApiError(message, status, error);
		},
	});
};
