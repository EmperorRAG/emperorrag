/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/send-verification-email/sendVerificationEmail.service.ts
 * @description Server-side service for send verification email operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import { APIError } from 'better-auth/api';
import type { sendVerificationEmailServerProps } from './sendVerificationEmail.types';
import { EmailAuthServerApiError } from '../shared/email.error';

/**
 * Send verification email using Better Auth server API.
 *
 * @pure
 * @description Wraps auth.api.sendVerificationEmail in an Effect, converting Promise-based
 * errors into typed EmailAuthServerApiError failures. Triggers email verification workflow.
 *
 * @remarks
 * **Functional Programming Pattern:**
 * - Curried function: `(deps) => (params) => Effect`
 * - Stage 1: Inject dependencies (authServer)
 * - Stage 2: Accept operation parameters (body, headers)
 * - Stage 3: Return lazy Effect (executed when run)
 *
 * **Email Verification Process:**
 * - Validates email exists in system
 * - Generates secure verification token
 * - Sends email with verification link
 * - Token expires after configured time period
 * - Returns success confirmation
 *
 * **Error Handling:**
 * - Better Auth throws APIError instances on failure
 * - Common errors: Email not found (404), already verified (400), rate limit (429)
 * - Status codes extracted and preserved in EmailAuthServerApiError
 * - Error cause chain maintained for debugging
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param deps - Dependencies bundle containing Better Auth server instance
 * @returns Curried function accepting params and returning an Effect
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { sendVerificationEmailServer } from './sendVerificationEmail.service';
 *
 * // Create the send verification email program
 * const program = Effect.gen(function* () {
 *   yield* sendVerificationEmailServer({ authServer })({
 *     body: {
 *       email: 'user@example.com',
 *       callbackURL: 'https://example.com/verify-success'
 *     }
 *   });
 *
 *   console.log('Verification email sent successfully');
 * });
 *
 * // Execute the Effect
 * await Effect.runPromise(program);
 * ```
 *
 * @example
 * ```typescript
 * // Handle already verified email
 * import * as Effect from 'effect/Effect';
 *
 * const program = sendVerificationEmailServer({ authServer })({
 *   body: { email: 'verified@example.com' }
 * });
 *
 * const handled = Effect.catchTag(program, 'EmailAuthServerApiError', (error) => {
 *   if (error.status === 400) {
 *     console.log('Email already verified');
 *     return Effect.succeed(undefined);
 *   }
 *   return Effect.fail(error);
 * });
 *
 * await Effect.runPromise(handled);
 * ```
 *
 * @example
 * ```typescript
 * // Send verification with retry logic
 * import { Effect, Schedule } from 'effect';
 *
 * const sendVerificationWithRetry = Effect.gen(function* () {
 *   yield* sendVerificationEmailServer({ authServer })({
 *     body: {
 *       email: 'user@example.com',
 *       callbackURL: 'https://example.com/verify'
 *     }
 *   }).pipe(
 *     Effect.retry(Schedule.exponential('100 millis', 2)),
 *     Effect.tap(() => Effect.log('Verification email sent'))
 *   );
 * });
 * ```
 */
export const sendVerificationEmailServer: sendVerificationEmailServerProps = (deps) => (params) => {
	const { authServer } = deps;

	return Effect.tryPromise({
		try: () => authServer.api.sendVerificationEmail(params),
		catch: (error) => {
			// Better Auth server throws APIError instances with status codes
			if (error instanceof APIError) {
				// Convert status to number (APIError.status is Status string union)
				const status = typeof error.status === 'number' ? error.status : parseInt(error.status as string, 10) || undefined;
				return new EmailAuthServerApiError(error.message, status, error);
			}
			// Handle non-APIError exceptions
			const message = error instanceof Error ? error.message : 'Send verification email failed';
			return new EmailAuthServerApiError(message, undefined, error);
		},
	});
};
