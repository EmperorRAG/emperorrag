/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/send-verification-email/sendVerificationEmail.types.ts
 * @description Type definitions for server-side send verification email operation.
 */

import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from '../../../server.types';
import type { CoreAuthServerError } from '../../shared/core.error';
import type { EmailAuthServerService } from '../shared/email.types';
import type * as Effect from 'effect/Effect';

/**
 * Type helper to extract the sendVerificationEmail endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `sendVerificationEmail` method from the server API. This method
 * triggers email verification workflow for existing users, sending a verification email with a secure token.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type SendVerificationMethod = AuthServerApiSendVerificationEmailPropsFor<typeof authServer>;
 * // (args: { body: { email: string, callbackURL?: string }, headers?: Headers, ... }) => Promise<...>
 *
 * // Usage in implementation
 * const sendVerification: AuthServerApiSendVerificationEmailPropsFor = authServer.api.sendVerificationEmail;
 * const result = await sendVerification({
 *   body: { email: 'user@example.com', callbackURL: 'https://example.com/verify' },
 *   headers: request.headers
 * });
 * ```
 */
export type AuthServerApiSendVerificationEmailPropsFor<T extends AuthServerFor = AuthServerFor> =
	'sendVerificationEmail' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['sendVerificationEmail'] : never;

/**
 * Type helper to extract the input parameter type for auth.api.sendVerificationEmail.
 *
 * @pure
 * @description Extracts the first parameter type from the sendVerificationEmail method.
 * Includes email address, optional callback URL, headers, and request options.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Input = AuthServerApiSendVerificationEmailParamsFor<typeof authServer>;
 * // { body: { email: string, callbackURL?: string }, headers?: Headers, asResponse?: boolean, ... }
 * ```
 */
export type AuthServerApiSendVerificationEmailParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<AuthServerApiSendVerificationEmailPropsFor<T>>[0];

/**
 * Type helper to extract the return type from auth.api.sendVerificationEmail.
 *
 * @pure
 * @description Extracts the Promise return type from the server API method.
 * The Promise resolves to a success confirmation.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Result = AuthServerApiSendVerificationEmailResultFor<typeof authServer>;
 * // Promise<{ status: boolean }>
 * ```
 */
export type AuthServerApiSendVerificationEmailResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<AuthServerApiSendVerificationEmailPropsFor<T>>;

/**
 * Function signature for sendVerificationEmail server service.
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
 * - CoreAuthServerApiError: API call failures with HTTP status codes
 * - Other CoreAuthServerError types from validation layers (if using controller)
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { sendVerificationEmailServerService } from './sendVerificationEmail.service';
 *
 * const program = sendVerificationEmailServerService({
 *   body: {
 *     email: 'user@example.com',
 *     callbackURL: 'https://example.com/verify-success'
 *   }
 * });
 *
 * // Provide context and run
 * await Effect.runPromise(
 *   program.pipe(Effect.provideService(EmailAuthServerServiceTag, { authServer }))
 * );
 * ```
 */
export interface sendVerificationEmailPropsFor<T extends AuthServerFor = AuthServerFor> {
	(
		params: AuthServerApiSendVerificationEmailParamsFor<T>
	): Effect.Effect<Awaited<AuthServerApiSendVerificationEmailResultFor<T>>, CoreAuthServerError, EmailAuthServerService>;
}

/**
 * Type guard for validating AuthServerApiSendVerificationEmailParamsFor.
 *
 * @pure
 * @description Narrows an unknown value to AuthServerApiSendVerificationEmailParamsFor<T> by checking
 * the required structural properties. Use after Zod validation to provide type narrowing
 * without casting.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param value - The value to check
 * @returns True if value conforms to AuthServerApiSendVerificationEmailParamsFor<T> structure
 */
export const isAuthServerApiSendVerificationEmailParamsFor = <T extends AuthServerFor = AuthServerFor>(
	value: unknown
): value is AuthServerApiSendVerificationEmailParamsFor<T> => {
	if (typeof value !== 'object' || value === null) return false;
	const obj = value as Record<string, unknown>;

	if (typeof obj.body !== 'object' || obj.body === null) return false;
	const body = obj.body as Record<string, unknown>;

	if (typeof body.email !== 'string') return false;

	return true;
};
