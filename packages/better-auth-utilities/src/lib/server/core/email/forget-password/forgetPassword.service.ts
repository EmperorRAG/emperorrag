/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/forget-password/forgetPassword.service.ts
 * @description Server-side service for forget password operation using Better Auth API.
 */

import * as Effect from "effect/Effect";
import { mapApiError } from "../../../../pipeline/map-api-error/mapApiError";
import { AuthServerTag } from "../../../server.service";
import type { AuthServerFor } from "../../../server.types";
import type { AuthServerApiForgetPasswordParamsFor, forgetPasswordPropsFor } from "./forgetPassword.types";

/**
 * Request password reset email using Better Auth server API.
 *
 * @pure
 * @description Wraps auth.api.forgetPassword in an Effect, converting Promise-based
 * errors into typed AuthServerApiError failures. Initiates password reset workflow
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
 * - Status codes extracted and preserved in AuthServerApiError
 * - Error cause chain maintained for debugging
 * - For security, should not reveal whether email exists in system
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - The forget password parameters including body and optional headers
 * @returns Effect requiring AuthServerTag context
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { forgetPasswordServerService } from './forgetPassword.service';
 * import { AuthServerTag } from '../../../server.service';
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
 *   program.pipe(Effect.provideService(AuthServerTag, authServer))
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
 * const handled = Effect.catchTag(program, 'AuthServerApiError', (error) => {
 *   if (error.status === 429) {
 *     console.error('Too many requests. Please try again later.');
 *     return Effect.fail(new Error('Rate limit exceeded'));
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
 *   forgetPasswordWithAudit.pipe(Effect.provideService(AuthServerTag, authServer))
 * );
 * ```
 */
export const forgetPasswordServerService: forgetPasswordPropsFor = (
  params: AuthServerApiForgetPasswordParamsFor<AuthServerFor>,
) =>
  Effect.flatMap(AuthServerTag, (authServer) =>
    Effect.tryPromise(() => authServer.api.forgetPassword(params)).pipe(
      Effect.catchAll(mapApiError),
    ));
