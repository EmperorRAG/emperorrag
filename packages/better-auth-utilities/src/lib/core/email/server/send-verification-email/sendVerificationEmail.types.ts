/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/send-verification-email/sendVerificationEmail.types.ts
 * @description Type definitions for server-side send verification email operation.
 */

import type { betterAuth } from 'better-auth';
import type { AuthServerFor } from '../../../../server/server.types';
import type { EmailAuthServerError } from '../shared/email.error';
import type { EmailAuthServerDeps } from '../shared/email.types';
import type { Effect } from 'effect';

/**
 * Type helper to extract the sendVerificationEmail method type from auth.api.
 *
 * @pure
 * @description Extracts the sendVerificationEmail method from Better Auth server API.
 * Send verification email triggers email confirmation workflow.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export type AuthServerSendVerificationEmailFor<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> =
	T extends infer S ? (S extends { api: { sendVerificationEmail: infer M } } ? M : never) : never;

/**
 * Type helper to extract the body parameter type for auth.api.sendVerificationEmail.
 *
 * @pure
 * @description Extracts the 'body' property type from the first parameter of sendVerificationEmail.
 * Includes email address and optional callback URL.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Body = SendVerificationEmailServerInput<typeof authServer>;
 * // { email: string, callbackURL?: string }
 * ```
 */
export type SendVerificationEmailServerInput<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> =
	Parameters<AuthServerSendVerificationEmailFor<T>>[0] extends { body: infer B } ? B : never;

/**
 * Type helper to extract the headers parameter type for auth.api.sendVerificationEmail.
 *
 * @pure
 * @description Server operations may accept Headers for request context.
 *
 * @example
 * ```typescript
 * import { headers } from 'next/headers';
 *
 * const requestHeaders: SendVerificationEmailServerHeaders = await headers();
 * ```
 */
export type SendVerificationEmailServerHeaders = Headers;

/**
 * Type helper for the complete parameter structure accepted by sendVerificationEmail service.
 *
 * @pure
 * @description Combines body, headers, and Better Auth server options into a single type.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @remarks
 * - body: Required verification email data (email, callbackURL)
 * - headers: Optional Headers for request context
 * - asResponse: Optional flag to return full Response object instead of parsed data
 * - returnHeaders: Optional flag to include response headers in result
 *
 * @example
 * ```typescript
 * const params: SendVerificationEmailServerParams<typeof authServer> = {
 *   body: {
 *     email: 'user@example.com',
 *     callbackURL: 'https://example.com/verify'
 *   },
 *   headers: await headers()
 * };
 * ```
 */
export type SendVerificationEmailServerParams<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = {
	body: SendVerificationEmailServerInput<T>;
	headers?: SendVerificationEmailServerHeaders;
	asResponse?: boolean;
	returnHeaders?: boolean;
};

/**
 * Type helper to extract the result type from auth.api.sendVerificationEmail.
 *
 * @pure
 * @description Extracts the resolved Promise return type from the server API method.
 * Typically returns success confirmation.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Result = SendVerificationEmailServerResult<typeof authServer>;
 * // { success: true, ... }
 * ```
 */
export type SendVerificationEmailServerResult<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = Awaited<
	ReturnType<AuthServerSendVerificationEmailFor<T>>
>;

/**
 * Function signature for sendVerificationEmail server service.
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
 * - EmailAuthServerApiError: API call failures (e.g., email not found, already verified)
 * - Other EmailAuthServerError types from validation layers (if using controller)
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { sendVerificationEmailServer } from './sendVerificationEmail.service';
 *
 * const program = Effect.gen(function* () {
 *   yield* sendVerificationEmailServer({ authServer })({
 *     body: {
 *       email: 'user@example.com',
 *       callbackURL: 'https://example.com/verify'
 *     }
 *   });
 *
 *   console.log('Verification email sent successfully');
 * });
 *
 * await Effect.runPromise(program);
 * ```
 */
export interface sendVerificationEmailServerProps<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> {
	(deps: EmailAuthServerDeps<T>): (params: SendVerificationEmailServerParams<T>) => Effect.Effect<SendVerificationEmailServerResult<T>, EmailAuthServerError>;
}
