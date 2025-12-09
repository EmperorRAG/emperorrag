/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/forget-password/forgetPassword.types.ts
 * @description Type definitions for server-side forget password (request password reset) operation.
 */

import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from '../../../server.types';
import type { EmailAuthServerError } from '../shared/email.error';
import type { EmailAuthServerService } from '../shared/email.types';
import type * as Effect from 'effect/Effect';

/**
 * Type helper to extract the forgetPassword endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `forgetPassword` method from the server API. This method
 * initiates the password reset workflow by sending a secure reset link via email.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type ForgetPasswordMethod = AuthServerApiForgetPasswordPropsFor<typeof authServer>;
 * // (args: { body: { email: string, redirectTo?: string }, headers?: Headers, ... }) => Promise<...>
 *
 * // Usage in implementation
 * const forgetPassword: AuthServerApiForgetPasswordPropsFor = authServer.api.forgetPassword;
 * const result = await forgetPassword({
 *   body: { email: 'user@example.com', redirectTo: 'https://example.com/reset' },
 *   headers: request.headers
 * });
 * ```
 */
export type AuthServerApiForgetPasswordPropsFor<T extends AuthServerFor = AuthServerFor> =
	'forgetPassword' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['forgetPassword'] : never;

/**
 * Type helper to extract the input parameter type for auth.api.forgetPassword.
 *
 * @pure
 * @description Extracts the first parameter type from the forgetPassword method.
 * Includes email address, optional redirect URL, headers, and request options.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Input = AuthServerApiForgetPasswordParamsFor<typeof authServer>;
 * // { body: { email: string, redirectTo?: string }, headers?: Headers, asResponse?: boolean, ... }
 * ```
 */
export type AuthServerApiForgetPasswordParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<AuthServerApiForgetPasswordPropsFor<T>>[0];

/**
 * Type helper to extract the return type from auth.api.forgetPassword.
 *
 * @pure
 * @description Extracts the Promise return type from the server API method.
 * The Promise resolves to success confirmation.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Result = AuthServerApiForgetPasswordResultFor<typeof authServer>;
 * // Promise<{ status: boolean }>
 * ```
 */
export type AuthServerApiForgetPasswordResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<AuthServerApiForgetPasswordPropsFor<T>>;

/**
 * Function signature for forgetPassword server service.
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
 * import { forgetPasswordServerService } from './forgetPassword.service';
 *
 * const program = forgetPasswordServerService({
 *   body: {
 *     email: 'user@example.com',
 *     redirectTo: 'https://example.com/reset-password'
 *   }
 * });
 *
 * // Provide context and run
 * await Effect.runPromise(
 *   program.pipe(Effect.provideService(EmailAuthServerServiceTag, { authServer }))
 * );
 * ```
 */
export interface forgetPasswordPropsFor<T extends AuthServerFor = AuthServerFor> {
	(
		params: AuthServerApiForgetPasswordParamsFor<T>
	): Effect.Effect<Awaited<AuthServerApiForgetPasswordResultFor<T>>, EmailAuthServerError, EmailAuthServerService>;
}

/**
 * Type guard for validating AuthServerApiForgetPasswordParamsFor.
 *
 * @pure
 * @description Narrows an unknown value to AuthServerApiForgetPasswordParamsFor<T> by checking
 * the required structural properties. Use after Zod validation to provide type narrowing
 * without casting.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param value - The value to check
 * @returns True if value conforms to AuthServerApiForgetPasswordParamsFor<T> structure
 */
export const isAuthServerApiForgetPasswordParamsFor = <T extends AuthServerFor = AuthServerFor>(
	value: unknown
): value is AuthServerApiForgetPasswordParamsFor<T> => {
	if (typeof value !== 'object' || value === null) return false;
	const obj = value as Record<string, unknown>;

	if (typeof obj.body !== 'object' || obj.body === null) return false;
	const body = obj.body as Record<string, unknown>;

	if (typeof body.email !== 'string') return false;

	return true;
};
