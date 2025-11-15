/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/reset-password/resetPassword.types.ts
 * @description Type definitions for server-side reset password operation.
 */

import type { betterAuth } from 'better-auth';
import type { AuthServerFor } from '../../../../server/server.types.js';
import type { EmailAuthServerError } from '../shared/email.error.js';
import type { EmailAuthServerDeps } from '../shared/email.types.js';
import type { Effect } from 'effect';

/**
 * Type helper to extract the resetPassword method type from auth.api.
 *
 * @pure
 * @description Extracts the resetPassword method from Better Auth server API.
 * Reset password completes the password reset workflow by setting a new password.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export type AuthServerResetPasswordFor<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> =
	T extends infer S ? (S extends { api: { resetPassword: infer M } } ? M : never) : never;

/**
 * Type helper to extract the body parameter type for auth.api.resetPassword.
 *
 * @pure
 * @description Extracts the 'body' property type from the first parameter of resetPassword.
 * Includes reset token and new password.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Body = ResetPasswordServerInput<typeof authServer>;
 * // { token: string, password: string }
 * ```
 */
export type ResetPasswordServerInput<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = Parameters<
	AuthServerResetPasswordFor<T>
>[0] extends { body: infer B }
	? B
	: never;

/**
 * Type helper to extract the headers parameter type for auth.api.resetPassword.
 *
 * @pure
 * @description Server operations may accept Headers for request context and session creation.
 *
 * @example
 * ```typescript
 * import { headers } from 'next/headers';
 *
 * const requestHeaders: ResetPasswordServerHeaders = await headers();
 * ```
 */
export type ResetPasswordServerHeaders = Headers;

/**
 * Type helper for the complete parameter structure accepted by resetPassword service.
 *
 * @pure
 * @description Combines body, headers, and Better Auth server options into a single type.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @remarks
 * - body: Required password reset data (token, password)
 * - headers: Optional Headers for request context and session cookie creation
 * - asResponse: Optional flag to return full Response object instead of parsed data
 * - returnHeaders: Optional flag to include response headers in result
 *
 * @example
 * ```typescript
 * const params: ResetPasswordServerParams<typeof authServer> = {
 *   body: {
 *     token: 'secure-reset-token-from-email',
 *     password: 'newSecurePassword123'
 *   },
 *   headers: await headers()
 * };
 * ```
 */
export type ResetPasswordServerParams<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = {
	body: ResetPasswordServerInput<T>;
	headers?: ResetPasswordServerHeaders;
	asResponse?: boolean;
	returnHeaders?: boolean;
};

/**
 * Type helper to extract the result type from auth.api.resetPassword.
 *
 * @pure
 * @description Extracts the resolved Promise return type from the server API method.
 * Typically returns success confirmation and new session information.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Result = ResetPasswordServerResult<typeof authServer>;
 * // { success: true, session: { id: string, ... }, user: { id: string, ... }, ... }
 * ```
 */
export type ResetPasswordServerResult<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = Awaited<
	ReturnType<AuthServerResetPasswordFor<T>>
>;

/**
 * Function signature for resetPassword server service.
 *
 * @pure
 * @description Curried function accepting dependencies first, then parameters, returning an Effect.
 * Follows the same pattern as other email operations for consistency.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @remarks
 * **Currying Stages:**
 * 1. Accept dependencies (authServer) → Return function accepting params
 * 2. Accept params (body, headers) → Return Effect
 * 3. Effect executes lazily when run
 *
 * **Error Channel:**
 * - EmailAuthServerApiError: API call failures (e.g., invalid/expired token, weak password)
 * - Other EmailAuthServerError types from validation layers (if using controller)
 *
 * @example
 * ```typescript
 * import { Effect } from 'effect';
 * import { resetPasswordServer } from './resetPassword.service.js';
 *
 * const program = Effect.gen(function* () {
 *   const result = yield* resetPasswordServer({ authServer })({
 *     body: {
 *       token: 'secure-reset-token-from-email',
 *       password: 'newSecurePassword123'
 *     },
 *     headers: requestHeaders
 *   });
 *
 *   console.log('Password reset successfully');
 *   return result;
 * });
 *
 * await Effect.runPromise(program);
 * ```
 */
export interface resetPasswordServerProps<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> {
	(deps: EmailAuthServerDeps<T>): (params: ResetPasswordServerParams<T>) => Effect.Effect<ResetPasswordServerResult<T>, EmailAuthServerError>;
}
