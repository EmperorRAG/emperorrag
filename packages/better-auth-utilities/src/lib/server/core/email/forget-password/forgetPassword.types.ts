/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/forget-password/forgetPassword.types.ts
 * @description Type definitions for server-side forget password (request password reset) operation.
 */

import type { betterAuth } from 'better-auth';
import type { AuthServerFor } from '../../../server.types';
import type { EmailAuthServerError } from '../shared/email.error';
import type { EmailAuthServerDeps } from '../shared/email.types';
import type { Effect } from 'effect';

/**
 * Type helper to extract the forgetPassword method type from auth.api.
 *
 * @pure
 * @description Extracts the forgetPassword method from Better Auth server API.
 * Forget password initiates the password reset workflow by sending a reset email.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export type AuthServerForgetPasswordFor<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> =
	T extends infer S ? (S extends { api: { forgetPassword: infer M } } ? M : never) : never;

/**
 * Type helper to extract the body parameter type for auth.api.forgetPassword.
 *
 * @pure
 * @description Extracts the 'body' property type from the first parameter of forgetPassword.
 * Includes email address and optional callback URL.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Body = ForgetPasswordServerInput<typeof authServer>;
 * // { email: string, redirectTo?: string }
 * ```
 */
export type ForgetPasswordServerInput<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = Parameters<
	AuthServerForgetPasswordFor<T>
>[0] extends { body: infer B }
	? B
	: never;

/**
 * Type helper to extract the headers parameter type for auth.api.forgetPassword.
 *
 * @pure
 * @description Server operations may accept Headers for request context.
 *
 * @example
 * ```typescript
 * import { headers } from 'next/headers';
 *
 * const requestHeaders: ForgetPasswordServerHeaders = await headers();
 * ```
 */
export type ForgetPasswordServerHeaders = Headers;

/**
 * Type helper for the complete parameter structure accepted by forgetPassword service.
 *
 * @pure
 * @description Combines body, headers, and Better Auth server options into a single type.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @remarks
 * - body: Required password reset request data (email, redirectTo)
 * - headers: Optional Headers for request context
 * - asResponse: Optional flag to return full Response object instead of parsed data
 * - returnHeaders: Optional flag to include response headers in result
 *
 * @example
 * ```typescript
 * const params: ForgetPasswordServerParams<typeof authServer> = {
 *   body: {
 *     email: 'user@example.com',
 *     redirectTo: 'https://example.com/reset-password'
 *   },
 *   headers: await headers()
 * };
 * ```
 */
export type ForgetPasswordServerParams<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = {
	body: ForgetPasswordServerInput<T>;
	headers?: ForgetPasswordServerHeaders;
	asResponse?: boolean;
	returnHeaders?: boolean;
};

/**
 * Type helper to extract the result type from auth.api.forgetPassword.
 *
 * @pure
 * @description Extracts the resolved Promise return type from the server API method.
 * Typically returns success confirmation.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Result = ForgetPasswordServerResult<typeof authServer>;
 * // { success: true, ... }
 * ```
 */
export type ForgetPasswordServerResult<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = Awaited<
	ReturnType<AuthServerForgetPasswordFor<T>>
>;

/**
 * Function signature for forgetPassword server service.
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
 * - EmailAuthServerApiError: API call failures (e.g., email not found, rate limit exceeded)
 * - Other EmailAuthServerError types from validation layers (if using controller)
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { forgetPasswordServer } from './forgetPassword.service';
 *
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
 * await Effect.runPromise(program);
 * ```
 */
export interface forgetPasswordServerProps<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> {
	(deps: EmailAuthServerDeps<T>): (params: ForgetPasswordServerParams<T>) => Effect.Effect<ForgetPasswordServerResult<T>, EmailAuthServerError>;
}
