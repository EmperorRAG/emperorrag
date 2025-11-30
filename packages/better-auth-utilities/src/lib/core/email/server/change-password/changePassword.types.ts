/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/change-password/changePassword.types.ts
 * @description Type definitions for server-side change password operation.
 */

import type { betterAuth } from 'better-auth';
import type { AuthServerFor } from '../../../../server/server.types';
import type { EmailAuthServerError } from '../shared/email.error';
import type { EmailAuthServerDeps } from '../shared/email.types';
import type { Effect } from 'effect';

/**
 * Type helper to extract the changePassword method type from auth.api.
 *
 * @pure
 * @description Extracts the changePassword method from Better Auth server API.
 * Change password requires current password verification before setting new password.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export type AuthServerChangePasswordFor<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> =
	T extends infer S ? (S extends { api: { changePassword: infer M } } ? M : never) : never;

/**
 * Type helper to extract the body parameter type for auth.api.changePassword.
 *
 * @pure
 * @description Extracts the 'body' property type from the first parameter of changePassword.
 * Includes current password, new password, and optional session revocation flag.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Body = ChangePasswordServerInput<typeof authServer>;
 * // { currentPassword: string, newPassword: string, revokeOtherSessions?: boolean }
 * ```
 */
export type ChangePasswordServerInput<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = Parameters<
	AuthServerChangePasswordFor<T>
>[0] extends { body: infer B }
	? B
	: never;

/**
 * Type helper to extract the headers parameter type for auth.api.changePassword.
 *
 * @pure
 * @description Server operations accept Headers for session identification and management.
 * Required to identify which user is changing their password.
 *
 * @example
 * ```typescript
 * import { headers } from 'next/headers';
 *
 * const requestHeaders: ChangePasswordServerHeaders = await headers();
 * ```
 */
export type ChangePasswordServerHeaders = Headers;

/**
 * Type helper for the complete parameter structure accepted by changePassword service.
 *
 * @pure
 * @description Combines body, headers, and Better Auth server options into a single type.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @remarks
 * - body: Required password change data (currentPassword, newPassword, revokeOtherSessions)
 * - headers: Required Headers for session identification
 * - asResponse: Optional flag to return full Response object instead of parsed data
 * - returnHeaders: Optional flag to include response headers in result
 *
 * @example
 * ```typescript
 * const params: ChangePasswordServerParams<typeof authServer> = {
 *   body: {
 *     currentPassword: 'oldPassword123',
 *     newPassword: 'newSecurePassword456',
 *     revokeOtherSessions: true
 *   },
 *   headers: await headers()
 * };
 * ```
 */
export type ChangePasswordServerParams<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = {
	body: ChangePasswordServerInput<T>;
	headers: ChangePasswordServerHeaders;
	asResponse?: boolean;
	returnHeaders?: boolean;
};

/**
 * Type helper to extract the result type from auth.api.changePassword.
 *
 * @pure
 * @description Extracts the resolved Promise return type from the server API method.
 * Typically returns success confirmation and updated session information.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Result = ChangePasswordServerResult<typeof authServer>;
 * // { success: true, session: { id: string, ... }, ... }
 * ```
 */
export type ChangePasswordServerResult<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = Awaited<
	ReturnType<AuthServerChangePasswordFor<T>>
>;

/**
 * Function signature for changePassword server service.
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
 * - EmailAuthServerApiError: API call failures (e.g., incorrect current password, weak new password)
 * - Other EmailAuthServerError types from validation layers (if using controller)
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { changePasswordServer } from './changePassword.service';
 *
 * const program = Effect.gen(function* () {
 *   const result = yield* changePasswordServer({ authServer })({
 *     body: {
 *       currentPassword: 'oldPassword123',
 *       newPassword: 'newSecurePassword456',
 *       revokeOtherSessions: true
 *     },
 *     headers: requestHeaders
 *   });
 *
 *   console.log('Password changed successfully');
 *   return result;
 * });
 *
 * await Effect.runPromise(program);
 * ```
 */
export interface changePasswordServerProps<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> {
	(deps: EmailAuthServerDeps<T>): (params: ChangePasswordServerParams<T>) => Effect.Effect<ChangePasswordServerResult<T>, EmailAuthServerError>;
}
