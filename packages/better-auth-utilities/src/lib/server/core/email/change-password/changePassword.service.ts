/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/change-password/changePassword.service.ts
 * @description Server-side service for change password operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import { APIError } from 'better-auth/api';
import type { changePasswordServerProps } from './changePassword.types';
import { EmailAuthServerApiError } from '../shared/email.error';

/**
 * Change user password using Better Auth server API.
 *
 * @pure
 * @description Wraps auth.api.changePassword in an Effect, converting Promise-based
 * errors into typed EmailAuthServerApiError failures. Verifies current password
 * before updating to new password.
 *
 * @remarks
 * **Functional Programming Pattern:**
 * - Curried function: `(deps) => (params) => Effect`
 * - Stage 1: Inject dependencies (authServer)
 * - Stage 2: Accept operation parameters (body, headers)
 * - Stage 3: Return lazy Effect (executed when run)
 *
 * **Password Change Process:**
 * - Validates current password against stored hash
 * - Rejects if current password is incorrect (401)
 * - Hashes new password securely (handled by Better Auth)
 * - Updates password in database
 * - Optionally revokes other active sessions
 * - Returns success confirmation with updated session
 *
 * **Error Handling:**
 * - Better Auth throws APIError instances on failure
 * - Common errors: Incorrect current password (401), weak new password (400)
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
 * import { changePasswordServer } from './changePassword.service';
 *
 * // Create the password change program
 * const program = Effect.gen(function* () {
 *   const result = yield* changePasswordServer({ authServer })({
 *     body: {
 *       currentPassword: 'oldPassword123',
 *       newPassword: 'newSecurePassword456',
 *       revokeOtherSessions: true
 *     },
 *     headers: await headers()
 *   });
 *
 *   console.log('Password changed successfully');
 *   return result;
 * });
 *
 * // Execute the Effect
 * await Effect.runPromise(program);
 * ```
 *
 * @example
 * ```typescript
 * // Handle incorrect current password error
 * import * as Effect from 'effect/Effect';
 *
 * const program = changePasswordServer({ authServer })({
 *   body: {
 *     currentPassword: 'wrongPassword',
 *     newPassword: 'newSecurePassword456'
 *   },
 *   headers: requestHeaders
 * });
 *
 * const handled = Effect.catchTag(program, 'EmailAuthServerApiError', (error) => {
 *   if (error.status === 401) {
 *     console.error('Current password is incorrect');
 *     return Effect.fail(new Error('Please verify your current password'));
 *   }
 *   return Effect.fail(error);
 * });
 *
 * await Effect.runPromise(handled);
 * ```
 *
 * @example
 * ```typescript
 * // Password change with security audit logging
 * import * as Effect from 'effect/Effect';
 *
 * const changePasswordWithAudit = Effect.gen(function* () {
 *   const result = yield* changePasswordServer({ authServer })({
 *     body: {
 *       currentPassword: 'oldPassword123',
 *       newPassword: 'newSecurePassword456',
 *       revokeOtherSessions: true
 *     },
 *     headers: requestHeaders
 *   });
 *
 *   // Log security event
 *   yield* logSecurityEvent({
 *     userId: result.session.userId,
 *     action: 'PASSWORD_CHANGED',
 *     timestamp: new Date(),
 *     revokedSessions: true
 *   });
 *
 *   // Send notification email
 *   yield* sendPasswordChangeNotification(result.session.userId);
 *
 *   return result;
 * });
 * ```
 */
export const changePasswordServer: changePasswordServerProps = (deps) => (params) => {
	const { authServer } = deps;

	return Effect.tryPromise({
		try: () => authServer.api.changePassword(params),
		catch: (error) => {
			// Better Auth server throws APIError instances with status codes
			if (error instanceof APIError) {
				// Convert status to number (APIError.status is Status string union)
				const status = typeof error.status === 'number' ? error.status : parseInt(error.status as string, 10) || undefined;
				return new EmailAuthServerApiError(error.message, status, error);
			}
			// Handle non-APIError exceptions
			const message = error instanceof Error ? error.message : 'Change password failed';
			return new EmailAuthServerApiError(message, undefined, error);
		},
	});
};
