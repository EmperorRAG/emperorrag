/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/change-password/changePassword.service.ts
 * @description Server-side service for change password operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import { AuthServerTag } from '../../../server.service';
import type { AuthServerFor } from '../../../server.types';
import { mapApiError } from '../../shared/core.error';
import type { AuthServerApiChangePasswordParamsFor, changePasswordPropsFor } from './changePassword.types';

/**
 * Change user password using Better Auth server API.
 *
 * @pure
 * @description Wraps auth.api.changePassword in an Effect, converting Promise-based
 * errors into typed AuthServerApiError failures. Verifies current password
 * before updating to new password.
 *
 * @remarks
 * **Context-Based Dependency Injection:**
 * - Dependencies (authServer) are accessed via Effect's context layer
 * - Function accepts only the API parameters directly
 * - Effect executes lazily when run with provided context
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
 * - Status codes extracted and preserved in AuthServerApiError
 * - Error cause chain maintained for debugging
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - The change password parameters including body and headers (required)
 * @returns Effect requiring AuthServerTag context
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { headers } from 'next/headers';
 * import { changePasswordServerService } from './changePassword.service';
 * import { AuthServerTag } from '../../../server.service';
 *
 * // Create the password change program
 * const program = changePasswordServerService({
 *   body: {
 *     currentPassword: 'oldPassword123',
 *     newPassword: 'newSecurePassword456',
 *     revokeOtherSessions: true
 *   },
 *   headers: await headers()
 * });
 *
 * // Provide context and execute
 * await Effect.runPromise(
 *   program.pipe(Effect.provideService(AuthServerTag, authServer))
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Handle incorrect current password error
 * import * as Effect from 'effect/Effect';
 *
 * const program = changePasswordServerService({
 *   body: {
 *     currentPassword: 'wrongPassword',
 *     newPassword: 'newSecurePassword456'
 *   },
 *   headers: requestHeaders
 * });
 *
 * const handled = Effect.catchTag(program, 'AuthServerApiError', (error) => {
 *   if (error.status === 401) {
 *     console.error('Current password is incorrect');
 *     return Effect.fail(new Error('Please verify your current password'));
 *   }
 *   return Effect.fail(error);
 * });
 *
 * await Effect.runPromise(
 *   handled.pipe(Effect.provideService(AuthServerTag, authServer))
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Password change with security audit logging
 * import * as Effect from 'effect/Effect';
 *
 * const changePasswordWithAudit = Effect.gen(function* () {
 *   const result = yield* changePasswordServerService({
 *     body: {
 *       currentPassword: 'oldPassword123',
 *       newPassword: 'newSecurePassword456',
 *       revokeOtherSessions: true
 *     },
 *     headers: requestHeaders
 *   });
 *
 *   // Log security event
 *   console.log('Password changed successfully');
 *
 *   return result;
 * });
 *
 * await Effect.runPromise(
 *   changePasswordWithAudit.pipe(Effect.provideService(AuthServerTag, authServer))
 * );
 * ```
 */
export const changePasswordServerService: changePasswordPropsFor = (params: AuthServerApiChangePasswordParamsFor<AuthServerFor>) =>
	Effect.flatMap(AuthServerTag, (authServer) =>
		Effect.tryPromise({
			try: () => authServer.api.changePassword(params),
			catch: mapApiError,
		})
	);
