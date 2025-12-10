/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/forget-password/forgetPassword.service.ts
 * @description Server-side service for forget password operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerApiForgetPasswordParamsFor, forgetPasswordPropsFor } from './forgetPassword.types';
import { mapBetterAuthApiErrorToCoreAuthError } from '../../shared/core.error';
import type { AuthServerFor } from '../../../server.types';
import { EmailAuthServerServiceTag } from '../shared/email.service';

/**
 * Request password reset email using Better Auth server API.
 *
 * @pure
 * @description Wraps auth.api.forgetPassword in an Effect, converting Promise-based
 * errors into typed CoreAuthServerApiError failures. Initiates password reset workflow
 * by sending a secure reset link via email.
 *
 * @remarks
 * **Context-Based Dependency Injection:**
 * - Dependencies (authServer) are accessed via Effect's context layer
 * - Function accepts only the API parameters directly
 * - Effect executes lazily when run with provided context
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
 * - Status codes extracted and preserved in CoreAuthServerApiError
 * - Error cause chain maintained for debugging
 * - For security, should not reveal whether email exists in system
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - The forget password parameters including body and optional headers
 * @returns Effect requiring EmailAuthServerService context
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { forgetPasswordServerService } from './forgetPassword.service';
 *
 * // Create the password reset request program
 * const program = forgetPasswordServerService({
 *   body: {
 *     email: 'user@example.com',
 *     redirectTo: 'https://example.com/reset-password'
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
 * // Handle rate limiting gracefully
 * import * as Effect from 'effect/Effect';
 *
 * const program = forgetPasswordServerService({
 *   body: { email: 'user@example.com' }
 * });
 *
 * const handled = Effect.catchTag(program, 'CoreAuthServerApiError', (error) => {
 *   if (error.status === 429) {
 *     console.error('Too many requests. Please try again later.');
 *     return Effect.fail(new Error('Rate limit exceeded'));
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
 * // Password reset request with audit logging
 * import * as Effect from 'effect/Effect';
 *
 * const forgetPasswordWithAudit = Effect.gen(function* () {
 *   const email = 'user@example.com';
 *
 *   yield* forgetPasswordServerService({
 *     body: {
 *       email,
 *       redirectTo: 'https://example.com/reset-password'
 *     }
 *   });
 *
 *   // Log security event
 *   console.log('Password reset requested for:', email);
 * });
 *
 * await Effect.runPromise(
 *   forgetPasswordWithAudit.pipe(Effect.provideService(EmailAuthServerServiceTag, { authServer }))
 * );
 * ```
 */
export const forgetPasswordServerService: forgetPasswordPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiForgetPasswordParamsFor<T>) =>
	Effect.flatMap(EmailAuthServerServiceTag, ({ authServer }) =>
		Effect.tryPromise({
			try: () => authServer.api.forgetPassword(params),
			catch: mapBetterAuthApiErrorToCoreAuthError,
		})
	);
