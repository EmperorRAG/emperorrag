/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/reset-password/resetPassword.types.ts
 * @description Type definitions for server-side reset password operation.
 */

import type * as Effect from "effect/Effect";
import type { AuthServerError } from "../../../../errors/authServer.error";
import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from "../../../server.types";

/**
 * Type helper to extract the resetPassword endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `resetPassword` method from the server API. This method
 * completes the password reset workflow by verifying the token and setting a new password.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type ResetPasswordMethod = AuthServerApiResetPasswordPropsFor<typeof authServer>;
 * // (args: { body: { token: string, newPassword: string }, headers?: Headers, ... }) => Promise<...>
 *
 * // Usage in implementation
 * const resetPassword: AuthServerApiResetPasswordPropsFor = authServer.api.resetPassword;
 * const result = await resetPassword({
 *   body: { token: 'reset-token', newPassword: 'newSecurePassword123' },
 *   headers: request.headers
 * });
 * ```
 */
export type AuthServerApiResetPasswordPropsFor<T extends AuthServerFor = AuthServerFor> = "resetPassword" extends
  AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>["resetPassword"] : never;

/**
 * Type helper to extract the input parameter type for auth.api.resetPassword.
 *
 * @pure
 * @description Extracts the first parameter type from the resetPassword method.
 * Includes reset token, new password, headers, and request options.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Input = AuthServerApiResetPasswordParamsFor<typeof authServer>;
 * // { body: { token: string, newPassword: string }, headers?: Headers, asResponse?: boolean, ... }
 * ```
 */
export type AuthServerApiResetPasswordParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<
  AuthServerApiResetPasswordPropsFor<AuthServerFor>
>[0];

/**
 * Type helper to extract the return type from auth.api.resetPassword.
 *
 * @pure
 * @description Extracts the Promise return type from the server API method.
 * The Promise resolves to success confirmation and optionally new session information.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Result = AuthServerApiResetPasswordResultFor<typeof authServer>;
 * // Promise<{ status: boolean, session?: { id: string, ... }, user?: { id: string, ... } }>
 * ```
 */
export type AuthServerApiResetPasswordResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<
  AuthServerApiResetPasswordPropsFor<AuthServerFor>
>;

/**
 * Function signature for resetPassword server service.
 *
 * @pure
 * @description Function accepting input parameters, returning an Effect that requires AuthServerForFor context.
 * Dependencies are accessed through Effect's context layer rather than curried function arguments.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @remarks
 * **Context-Based Dependency Injection:**
 * - Dependencies (authServer) are provided via Effect's context layer (AuthServerFor)
 * - Function accepts only the API parameters directly
 * - Effect executes lazily when run with provided context
 *
 * **Error Channel:**
 * - AuthServerApiError: API call failures with HTTP status codes
 * - Other AuthServerError types from validation layers (if using controller)
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { resetPasswordServerService } from './resetPassword.service';
 *
 * const program = resetPasswordServerService({
 *   body: {
 *     token: 'secure-reset-token-from-email',
 *     newPassword: 'newSecurePassword123'
 *   },
 *   headers: requestHeaders
 * });
 *
 * // Provide context and run
 * await Effect.runPromise(
 *   program.pipe(Effect.provideService(AuthServerTag, authServer))
 * );
 * ```
 */
export interface resetPasswordPropsFor<T extends AuthServerFor = AuthServerFor> {
  (
    params: AuthServerApiResetPasswordParamsFor<AuthServerFor>,
  ): Effect.Effect<Awaited<AuthServerApiResetPasswordResultFor<AuthServerFor>>, AuthServerError, AuthServerFor>;
}

/**
 * Type guard for validating AuthServerApiResetPasswordParamsFor.
 *
 * @pure
 * @description Narrows an unknown value to AuthServerApiResetPasswordParamsFor<AuthServerFor> by checking
 * the required structural properties. Use after Zod validation to provide type narrowing
 * without casting.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param value - The value to check
 * @returns True if value conforms to AuthServerApiResetPasswordParamsFor<AuthServerFor> structure
 */
export const isAuthServerApiResetPasswordParamsFor = (
  value: unknown,
): value is AuthServerApiResetPasswordParamsFor<AuthServerFor> => {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;

  if (typeof obj.body !== "object" || obj.body === null) return false;
  const body = obj.body as Record<string, unknown>;

  if (typeof body.token !== "string") return false;
  if (typeof body.newPassword !== "string") return false;

  return true;
};
