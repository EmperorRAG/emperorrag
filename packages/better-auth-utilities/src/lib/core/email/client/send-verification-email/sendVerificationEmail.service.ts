import { Effect } from 'effect';
import type { sendVerificationEmailProps } from './sendVerificationEmail.types.js';
import { EmailAuthApiError } from '../shared/email.error.js';

/**
 * Send a verification email to the specified email address using Better Auth.
 *
 * @pure
 * @description Wraps the Better Auth `sendVerificationEmail` API call in an Effect, converting Promise-based
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
 * import { sendVerificationEmail } from './sendVerificationEmail.service.js';
 *
 * const program = Effect.gen(function* () {
 *   const result = yield* sendVerificationEmail({ authClient })({
 *     email: 'user@example.com',
 *     callbackURL: 'https://example.com/verify'
 *   });
 *
 *   console.log('Verification email sent successfully');
 *   return result;
 * });
 * ```
 *
 * @param deps - Dependencies bundle containing the Better Auth client
 * @returns Curried function accepting send verification input and returning an Effect
 */
export const sendVerificationEmail: sendVerificationEmailProps = (deps) => (input) => {
	const { authClient } = deps;

	return Effect.tryPromise({
		try: () => authClient.sendVerificationEmail(input),
		catch: (error) => {
			const message = error instanceof Error ? error.message : 'Send verification email failed';
			const status = error && typeof error === 'object' && 'status' in error ? (error.status as number) : undefined;
			return new EmailAuthApiError(message, status, error);
		},
	});
};
