/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/forget-password/forgetPassword.service.ts
 * @description Server-side service for forget password operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import { APIError } from 'better-auth/api';
import type { forgetPasswordServerProps } from './forgetPassword.types';
import { EmailAuthServerApiError } from '../shared/email.error';

/**
 * Request password reset email using Better Auth server API.
 *
 * @pure
 * @description Wraps auth.api.forgetPassword in an Effect, converting Promise-based
 * errors into typed EmailAuthServerApiError failures. Initiates password reset workflow
 * by sending a secure reset link via email.
 *
 * @remarks
 * **Functional Programming Pattern:**
 * - Curried function: `(deps) => (params) => Effect`
 * - Stage 1: Inject dependencies (authServer)
 * - Stage 2: Accept operation parameters (body, headers)
 * - Stage 3: Return lazy Effect (executed when run)
 *
 * **Password Reset Process:**
 * - Validates email exists in system
 * - Generates secure reset token with expiration
 * - Sends email with reset link containing token
 * - Token is single-use and time-limited (typically 1 hour)
 * - Returns success confirmation (even if email not found for security)
 *
 * **Error Handling:**
 * - Better Auth throws APIError instances on failure
 * - Common errors: Rate limit exceeded (429), email service failure (500)
 * - Status codes extracted and preserved in EmailAuthServerApiError
 * - Error cause chain maintained for debugging
 * - For security, should not reveal whether email exists in system
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param deps - Dependencies bundle containing Better Auth server instance
 * @returns Curried function accepting params and returning an Effect
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { forgetPasswordServer } from './forgetPassword.service';
 *
 * // Create the password reset request program
 * const program = Effect.gen(function* () {
 *   yield* forgetPasswordServer({ authServer })({
 *     body: {
 *       email: 'user@example.com',
 *       redirectTo: 'https://example.com/reset-password'
 *     }
 *   });
 *
 *   console.log('Password reset email sent successfully');
 * });
 *
 * // Execute the Effect
 * await Effect.runPromise(program);
 * ```
 *
 * @example
 * ```typescript
 * // Handle rate limiting gracefully
 * import * as Effect from 'effect/Effect';
 *
 * const program = forgetPasswordServer({ authServer })({
 *   body: { email: 'user@example.com' }
 * });
 *
 * const handled = Effect.catchTag(program, 'EmailAuthServerApiError', (error) => {
 *   if (error.status === 429) {
 *     console.error('Too many requests. Please try again later.');
 *     return Effect.fail(new Error('Rate limit exceeded'));
 *   }
 *   return Effect.fail(error);
 * });
 *
 * await Effect.runPromise(handled);
 * ```
 *
 * @example
 * ```typescript
 * // Password reset with audit logging
 * import * as Effect from 'effect/Effect';
 *
 * const forgetPasswordWithAudit = Effect.gen(function* () {
 *   const email = 'user@example.com';
 *
 *   yield* forgetPasswordServer({ authServer })({
 *     body: {
 *       email,
 *       redirectTo: 'https://example.com/reset-password'
 *     }
 *   });
 *
 *   // Log security event
 *   yield* logSecurityEvent({
 *     action: 'PASSWORD_RESET_REQUESTED',
 *     email,
 *     timestamp: new Date(),
 *     ipAddress: requestIp
 *   });
 *
 *   console.log('Password reset email sent and logged');
 * });
 * ```
 */
export const forgetPasswordServer: forgetPasswordServerProps = (deps) => (params) => {
	const { authServer } = deps;

	return Effect.tryPromise({
		try: () => authServer.api.forgetPassword(params),
		catch: (error) => {
			// Better Auth server throws APIError instances with status codes
			if (error instanceof APIError) {
				// Convert status to number (APIError.status is Status string union)
				const status = typeof error.status === 'number' ? error.status : parseInt(error.status as string, 10) || undefined;
				return new EmailAuthServerApiError(error.message, status, error);
			}
			// Handle non-APIError exceptions
			const message = error instanceof Error ? error.message : 'Forget password failed';
			return new EmailAuthServerApiError(message, undefined, error);
		},
	});
};
