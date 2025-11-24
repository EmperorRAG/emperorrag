import * as Effect from 'effect/Effect';
import type { signUpEmailProps } from './signUpEmail.types.js';
import { EmailAuthApiError } from '../shared/email.error.js';

/**
 * Sign up a user via email and password using Better Auth.
 *
 * @pure
 * @description Wraps the Better Auth `signUp.email` API call in an Effect, converting Promise-based
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
 * import { signUpEmail } from './signUpEmail.service.js';
 *
 * const program = Effect.gen(function* () {
 *   const result = yield* signUpEmail({ authClient })({
 *     name: 'John Doe',
 *     email: 'user@example.com',
 *     password: 'securePassword123',
 *     image: 'https://example.com/avatar.jpg'
 *   });
 *
 *   console.log('Signed up:', result.user.email);
 *   return result;
 * });
 * ```
 *
 * @param deps - Dependencies bundle containing the Better Auth client
 * @returns Curried function accepting sign-up input and returning an Effect
 */
export const signUpEmailClient: signUpEmailProps = (deps) => (input) => {
	const { authClient } = deps;

	return Effect.tryPromise({
		try: () => authClient.signUp.email(input),
		catch: (error) => {
			const message = error instanceof Error ? error.message : 'Sign up failed';
			const status = error && typeof error === 'object' && 'status' in error ? (error.status as number) : undefined;
			return new EmailAuthApiError(message, status, error);
		},
	});
};
