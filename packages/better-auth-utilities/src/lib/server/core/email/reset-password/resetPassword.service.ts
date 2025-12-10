/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/reset-password/resetPassword.service.ts
 * @description Server-side service for reset password operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerApiResetPasswordParamsFor, resetPasswordPropsFor } from './resetPassword.types';
import { mapBetterAuthApiErrorToEmailAuthError } from '../shared/email.error';
import type { AuthServerFor } from '../../../server.types';
import { EmailAuthServerServiceTag } from '../shared/email.service';

/**
 * Reset user password using Better Auth server API.
 *
 * @pure
 * @description Wraps auth.api.resetPassword in an Effect, converting Promise-based
 * errors into typed EmailAuthServerApiError failures. Completes password reset workflow
 * by verifying token and setting new password.
 *
 * @remarks
 * **Context-Based Dependency Injection:**
 * - Dependencies (authServer) are accessed via Effect's context layer
 * - Function accepts only the API parameters directly
 * - Effect executes lazily when run with provided context
 *
 * **Password Reset Process:**
 * - Validates reset token exists and is not expired
 * - Validates token has not been used previously
 * - Hashes new password securely (handled by Better Auth)
 * - Updates password in database
 * - Invalidates reset token (single-use)
 * - Creates new session if headers provided
 * - Returns user data and session information
 *
 * **Error Handling:**
 * - Better Auth throws APIError instances on failure
 * - Common errors: Invalid/expired token (400/401), weak password (400), token already used (400)
 * - Status codes extracted and preserved in EmailAuthServerApiError
 * - Error cause chain maintained for debugging
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - The reset password parameters including body and optional headers
 * @returns Effect requiring EmailAuthServerService context
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { headers } from 'next/headers';
 * import { resetPasswordServerService } from './resetPassword.service';
 *
 * // Create the password reset program
 * const program = resetPasswordServerService({
 *   body: {
 *     token: 'secure-reset-token-from-email',
 *     newPassword: 'newSecurePassword123'
 *   },
 *   headers: await headers()
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
 * // Handle expired token error
 * import * as Effect from 'effect/Effect';
 *
 * const program = resetPasswordServerService({
 *   body: {
 *     token: 'expired-token',
 *     newPassword: 'newSecurePassword123'
 *   },
 *   headers: requestHeaders
 * });
 *
 * const handled = Effect.catchTag(program, 'EmailAuthServerApiError', (error) => {
 *   if (error.status === 400 || error.status === 401) {
 *     console.error('Reset token is invalid or expired');
 *     return Effect.fail(new Error('Please request a new password reset'));
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
 * // Password reset with post-reset actions
 * import * as Effect from 'effect/Effect';
 *
 * const resetPasswordWithActions = Effect.gen(function* () {
 *   const { authServer } = yield* EmailAuthServerServiceTag;
 *
 *   const result = yield* resetPasswordServerService({
 *     body: {
 *       token: resetToken,
 *       newPassword: 'newSecurePassword123'
 *     },
 *     headers: requestHeaders
 *   });
 *
 *   // Log security event
 *   console.log('Password reset completed for user');
 *
 *   return result;
 * });
 *
 * await Effect.runPromise(
 *   resetPasswordWithActions.pipe(Effect.provideService(EmailAuthServerServiceTag, { authServer }))
 * );
 * ```
 */
export const resetPasswordServerService: resetPasswordPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiResetPasswordParamsFor<T>) =>
	Effect.flatMap(EmailAuthServerServiceTag, ({ authServer }) =>
		Effect.tryPromise({
			try: () => authServer.api.resetPassword(params),
			catch: mapBetterAuthApiErrorToEmailAuthError,
		})
	);
