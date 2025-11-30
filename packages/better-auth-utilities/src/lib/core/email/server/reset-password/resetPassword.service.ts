/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/reset-password/resetPassword.service.ts
 * @description Server-side service for reset password operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import { APIError } from 'better-auth/api';
import type { resetPasswordServerProps } from './resetPassword.types';
import { EmailAuthServerApiError } from '../shared/email.error';

/**
 * Reset user password using Better Auth server API.
 *
 * @pure
 * @description Wraps auth.api.resetPassword in an Effect, converting Promise-based
 * errors into typed EmailAuthServerApiError failures. Completes password reset workflow
 * by verifying token and setting new password.
 *
 * @remarks
 * **Functional Programming Pattern:**
 * - Curried function: `(deps) => (params) => Effect`
 * - Stage 1: Inject dependencies (authServer)
 * - Stage 2: Accept operation parameters (body, headers)
 * - Stage 3: Return lazy Effect (executed when run)
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
 * @param deps - Dependencies bundle containing Better Auth server instance
 * @returns Curried function accepting params and returning an Effect
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { headers } from 'next/headers';
 * import { resetPasswordServer } from './resetPassword.service';
 *
 * // Create the password reset program
 * const program = Effect.gen(function* () {
 *   const result = yield* resetPasswordServer({ authServer })({
 *     body: {
 *       token: 'secure-reset-token-from-email',
 *       password: 'newSecurePassword123'
 *     },
 *     headers: await headers()
 *   });
 *
 *   console.log('Password reset successfully');
 *   console.log('User ID:', result.user.id);
 *   console.log('New session created:', result.session.id);
 *   return result;
 * });
 *
 * // Execute the Effect
 * await Effect.runPromise(program);
 * ```
 *
 * @example
 * ```typescript
 * // Handle expired token error
 * import * as Effect from 'effect/Effect';
 *
 * const program = resetPasswordServer({ authServer })({
 *   body: {
 *     token: 'expired-token',
 *     password: 'newSecurePassword123'
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
 * await Effect.runPromise(handled);
 * ```
 *
 * @example
 * ```typescript
 * // Password reset with post-reset actions
 * import * as Effect from 'effect/Effect';
 *
 * const resetPasswordWithActions = Effect.gen(function* () {
 *   const result = yield* resetPasswordServer({ authServer })({
 *     body: {
 *       token: resetToken,
 *       password: 'newSecurePassword123'
 *     },
 *     headers: requestHeaders
 *   });
 *
 *   // Log security event
 *   yield* logSecurityEvent({
 *     userId: result.user.id,
 *     action: 'PASSWORD_RESET_COMPLETED',
 *     timestamp: new Date()
 *   });
 *
 *   // Send confirmation email
 *   yield* sendPasswordResetConfirmationEmail(result.user.email);
 *
 *   // Revoke any active password reset tokens
 *   yield* revokeOtherResetTokens(result.user.id);
 *
 *   return result;
 * });
 * ```
 */
export const resetPasswordServer: resetPasswordServerProps = (deps) => (params) => {
	const { authServer } = deps;

	return Effect.tryPromise({
		try: () => authServer.api.resetPassword(params),
		catch: (error) => {
			// Better Auth server throws APIError instances with status codes
			if (error instanceof APIError) {
				// Convert status to number (APIError.status is Status string union)
				const status = typeof error.status === 'number' ? error.status : parseInt(error.status as string, 10) || undefined;
				return new EmailAuthServerApiError(error.message, status, error);
			}
			// Handle non-APIError exceptions
			const message = error instanceof Error ? error.message : 'Reset password failed';
			return new EmailAuthServerApiError(message, undefined, error);
		},
	});
};
