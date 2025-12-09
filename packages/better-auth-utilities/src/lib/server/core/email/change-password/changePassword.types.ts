/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/change-password/changePassword.types.ts
 * @description Type definitions for server-side change password operation.
 */

import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from '../../../server.types';
import type { EmailAuthServerError } from '../shared/email.error';
import type { EmailAuthServerService } from '../shared/email.types';
import type * as Effect from 'effect/Effect';

/**
 * Type helper to extract the changePassword endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `changePassword` method from the server API. This method
 * changes the user's password after verifying the current password.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type ChangePasswordMethod = AuthServerApiChangePasswordPropsFor<typeof authServer>;
 * // (args: { body: { currentPassword: string, newPassword: string, ... }, headers: Headers, ... }) => Promise<...>
 *
 * // Usage in implementation
 * const changePassword: AuthServerApiChangePasswordPropsFor = authServer.api.changePassword;
 * const result = await changePassword({
 *   body: { currentPassword: 'oldPassword', newPassword: 'newSecurePassword123' },
 *   headers: request.headers
 * });
 * ```
 */
export type AuthServerApiChangePasswordPropsFor<T extends AuthServerFor = AuthServerFor> =
	'changePassword' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['changePassword'] : never;

/**
 * Type helper to extract the input parameter type for auth.api.changePassword.
 *
 * @pure
 * @description Extracts the first parameter type from the changePassword method.
 * Includes current password, new password, headers (required), and request options.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Input = AuthServerApiChangePasswordParamsFor<typeof authServer>;
 * // { body: { currentPassword: string, newPassword: string, revokeOtherSessions?: boolean }, headers: Headers, ... }
 * ```
 */
export type AuthServerApiChangePasswordParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<AuthServerApiChangePasswordPropsFor<T>>[0];

/**
 * Type helper to extract the return type from auth.api.changePassword.
 *
 * @pure
 * @description Extracts the Promise return type from the server API method.
 * The Promise resolves to success confirmation and updated session information.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Result = AuthServerApiChangePasswordResultFor<typeof authServer>;
 * // Promise<{ status: boolean, session?: { id: string, ... } }>
 * ```
 */
export type AuthServerApiChangePasswordResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<AuthServerApiChangePasswordPropsFor<T>>;

/**
 * Function signature for changePassword server service.
 *
 * @pure
 * @description Function accepting input parameters, returning an Effect that requires EmailAuthServerServiceFor context.
 * Dependencies are accessed through Effect's context layer rather than curried function arguments.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @remarks
 * **Context-Based Dependency Injection:**
 * - Dependencies (authServer) are provided via Effect's context layer (EmailAuthServerServiceFor<T>)
 * - Function accepts only the API parameters directly
 * - Effect executes lazily when run with provided context
 *
 * **Error Channel:**
 * - EmailAuthServerApiError: API call failures with HTTP status codes
 * - Other EmailAuthServerError types from validation layers (if using controller)
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { changePasswordServerService } from './changePassword.service';
 *
 * const program = changePasswordServerService({
 *   body: {
 *     currentPassword: 'oldPassword123',
 *     newPassword: 'newSecurePassword456',
 *     revokeOtherSessions: true
 *   },
 *   headers: requestHeaders
 * });
 *
 * // Provide context and run
 * await Effect.runPromise(
 *   program.pipe(Effect.provideService(EmailAuthServerServiceTag, { authServer }))
 * );
 * ```
 */
export interface changePasswordPropsFor<T extends AuthServerFor = AuthServerFor> {
	(
		params: AuthServerApiChangePasswordParamsFor<T>
	): Effect.Effect<Awaited<AuthServerApiChangePasswordResultFor<T>>, EmailAuthServerError, EmailAuthServerService>;
}

/**
 * Type guard for validating AuthServerApiChangePasswordParamsFor.
 *
 * @pure
 * @description Narrows an unknown value to AuthServerApiChangePasswordParamsFor<T> by checking
 * the required structural properties. Use after Zod validation to provide type narrowing
 * without casting.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param value - The value to check
 * @returns True if value conforms to AuthServerApiChangePasswordParamsFor<T> structure
 */
export const isAuthServerApiChangePasswordParamsFor = <T extends AuthServerFor = AuthServerFor>(
	value: unknown
): value is AuthServerApiChangePasswordParamsFor<T> => {
	if (typeof value !== 'object' || value === null) return false;
	const obj = value as Record<string, unknown>;

	if (typeof obj.body !== 'object' || obj.body === null) return false;
	const body = obj.body as Record<string, unknown>;

	if (typeof body.currentPassword !== 'string') return false;
	if (typeof body.newPassword !== 'string') return false;

	// headers is required for changePassword
	if (!(obj.headers instanceof Headers)) return false;

	return true;
};
