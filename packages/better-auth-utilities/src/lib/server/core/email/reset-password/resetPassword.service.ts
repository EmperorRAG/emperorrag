/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/reset-password/resetPassword.service.ts
 * @description Server-side service for reset password operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import { mapApiError } from '../../../../pipeline/map-api-error/mapApiError';
import { AuthServerTag } from '../../../server.service';
import type { AuthServerFor } from '../../../server.types';
import type { AuthServerApiResetPasswordParamsFor, resetPasswordPropsFor } from './resetPassword.types';

/**
 * Reset user password using Better Auth server API.
 *
 * @pure
 * @description Wraps auth.api.resetPassword in an Effect, converting Promise-based
 * errors into typed AuthServerApiError failures. Completes password reset workflow
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
 * - Status codes extracted and preserved in AuthServerApiError
 * - Error cause chain maintained for debugging
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - The reset password parameters including body and optional headers
 * @returns Effect requiring AuthServerFor context
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
 *   program.pipe(Effect.provideService(AuthServerTag, authServer))
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
 * const handled = Effect.catchTag(program, 'AuthServerApiError', (error) => {
 *   if (error.status === 400 || error.status === 401) {
 *     console.error('Reset token is invalid or expired');
 *     return Effect.fail(new Error('Please request a new password reset'));
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
 * // Password reset with post-reset actions
 * import * as Effect from 'effect/Effect';
 *
 * const resetPasswordWithActions = Effect.gen(function* () {
 *   const authServer = yield* AuthServerTag;
 *
 *   // ...
 * });
 * ```
 */
export const resetPasswordServerService: resetPasswordPropsFor = (params: AuthServerApiResetPasswordParamsFor<AuthServerFor>) =>
	Effect.flatMap(AuthServerTag, (authServer) =>
		Effect.tryPromise({
			try: () => authServer.api.resetPassword(params),
			catch: mapApiError,
		})
	);
