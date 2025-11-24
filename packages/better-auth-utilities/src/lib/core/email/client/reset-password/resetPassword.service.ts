import * as Effect from 'effect/Effect';
import type { resetPasswordProps } from './resetPassword.types.js';
import { EmailAuthApiError } from '../shared/email.error.js';

/**
 * Reset a user's password using Better Auth.
 *
 * @pure
 * @description Wraps the Better Auth `resetPassword` API call in an Effect, converting Promise-based
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
 * import { resetPassword } from './resetPassword.service.js';
 *
 * const program = Effect.gen(function* () {
 *   const result = yield* resetPassword({ authClient })({
 *     newPassword: 'newSecurePassword123',
 *     token: 'verification-token-abc123',
 *     callbackURL: 'https://example.com/login'
 *   });
 *
 *   console.log('Password reset successfully');
 *   return result;
 * });
 * ```
 *
 * @param deps - Dependencies bundle containing the Better Auth client
 * @returns Curried function accepting reset password input and returning an Effect
 */
export const resetPassword: resetPasswordProps = (deps) => (input) => {
	const { authClient } = deps;

	return Effect.tryPromise({
		try: () => authClient.resetPassword(input),
		catch: (error) => {
			const message = error instanceof Error ? error.message : 'Reset password failed';
			const status = error && typeof error === 'object' && 'status' in error ? (error.status as number) : undefined;
			return new EmailAuthApiError(message, status, error);
		},
	});
};
