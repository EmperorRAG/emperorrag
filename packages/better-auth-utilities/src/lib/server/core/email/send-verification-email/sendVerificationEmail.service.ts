/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/send-verification-email/sendVerificationEmail.service.ts
 * @description Server-side service for send verification email operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerApiSendVerificationEmailParamsFor, sendVerificationEmailPropsFor } from './sendVerificationEmail.types';
import { mapBetterAuthApiErrorToCoreAuthError } from '../../shared/core.error';
import type { AuthServerFor } from '../../../server.types';
import { EmailAuthServerServiceTag } from '../shared/email.service';

/**
 * Send verification email using Better Auth server API.
 *
 * @pure
 * @description Wraps auth.api.sendVerificationEmail in an Effect, converting Promise-based
 * errors into typed CoreAuthServerApiError failures. Triggers email verification workflow
 * for existing users.
 *
 * @remarks
 * **Context-Based Dependency Injection:**
 * - Dependencies (authServer) are accessed via Effect's context layer
 * - Function accepts only the API parameters directly
 * - Effect executes lazily when run with provided context
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
 * - Status codes extracted and preserved in CoreAuthServerApiError
 * - Error cause chain maintained for debugging
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - The send verification email parameters including body and optional headers
 * @returns Effect requiring EmailAuthServerService context
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { sendVerificationEmailServerService } from './sendVerificationEmail.service';
 *
 * // Create the send verification email program
 * const program = sendVerificationEmailServerService({
 *   body: {
 *     email: 'user@example.com',
 *     callbackURL: 'https://example.com/verify-success'
 *   }
 * });
 *
 * // Provide context and execute
 * await Effect.runPromise(
 *   program.pipe(Effect.provideService(EmailAuthServerServiceTag, { authServer }))
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Handle already verified email
 * import * as Effect from 'effect/Effect';
 *
 * const program = sendVerificationEmailServerService({
 *   body: { email: 'verified@example.com' }
 * });
 *
 * const handled = Effect.catchTag(program, 'CoreAuthServerApiError', (error) => {
 *   if (error.status === 400) {
 *     console.log('Email already verified');
 *     return Effect.succeed(undefined);
 *   }
 *   return Effect.fail(error);
 * });
 *
 * await Effect.runPromise(
 *   handled.pipe(Effect.provideService(EmailAuthServerServiceTag, { authServer }))
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Send verification with retry logic
 * import { Effect, Schedule } from 'effect';
 *
 * const sendVerificationWithRetry = sendVerificationEmailServerService({
 *   body: {
 *     email: 'user@example.com',
 *     callbackURL: 'https://example.com/verify'
 *   }
 * }).pipe(
 *   Effect.retry(Schedule.exponential('100 millis', 2)),
 *   Effect.tap(() => Effect.log('Verification email sent'))
 * );
 *
 * await Effect.runPromise(
 *   sendVerificationWithRetry.pipe(Effect.provideService(EmailAuthServerServiceTag, { authServer }))
 * );
 * ```
 */
export const sendVerificationEmailServerService: sendVerificationEmailPropsFor = <T extends AuthServerFor = AuthServerFor>(
	params: AuthServerApiSendVerificationEmailParamsFor<T>
) =>
	Effect.flatMap(EmailAuthServerServiceTag, ({ authServer }) =>
		Effect.tryPromise({
			try: () => authServer.api.sendVerificationEmail(params),
			catch: mapBetterAuthApiErrorToCoreAuthError,
		})
	);
