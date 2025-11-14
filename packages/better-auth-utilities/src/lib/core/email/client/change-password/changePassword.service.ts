import { Effect } from 'effect';
import type { changePasswordProps } from './changePassword.types.js';
import { EmailAuthApiError } from '../shared/email.error.js';

/**
 * Change the password for the currently authenticated user using Better Auth.
 *
 * @pure
 * @description Wraps the Better Auth `changePassword` API call in an Effect, converting Promise-based
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
 * import { Effect } from 'effect';
 * import { changePassword } from './changePassword.service.js';
 *
 * const program = Effect.gen(function* () {
 *   const result = yield* changePassword({ authClient })({
 *     newPassword: 'newSecurePassword123',
 *     currentPassword: 'oldPassword123',
 *     revokeOtherSessions: true
 *   });
 *
 *   console.log('Password changed successfully');
 *   return result;
 * });
 * ```
 *
 * @param deps - Dependencies bundle containing the Better Auth client
 * @returns Curried function accepting change password input and returning an Effect
 */
export const changePassword: changePasswordProps = (deps) => (input) => {
	const { authClient } = deps;

	return Effect.tryPromise({
		try: () => authClient.changePassword(input),
		catch: (error) => {
			const message = error instanceof Error ? error.message : 'Change password failed';
			const status = error && typeof error === 'object' && 'status' in error ? (error.status as number) : undefined;
			return new EmailAuthApiError(message, status, error);
		},
	});
};
