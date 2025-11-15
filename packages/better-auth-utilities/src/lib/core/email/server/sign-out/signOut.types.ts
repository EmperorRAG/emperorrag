/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/sign-out/signOut.types.ts
 * @description Type definitions for server-side sign-out operation.
 */

import type { betterAuth } from 'better-auth';
import type { AuthServerFor } from '../../../../server/server.types.js';
import type { EmailAuthServerError } from '../shared/email.error.js';
import type { EmailAuthServerDeps } from '../shared/email.types.js';
import type { Effect } from 'effect';

/**
 * Type helper to extract the signOut method type from auth.api.
 *
 * @pure
 * @description Extracts the signOut method from Better Auth server API.
 * Sign-out typically does not require body parameters.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export type AuthServerSignOutFor<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = T extends infer S
	? S extends { api: { signOut: infer M } }
		? M
		: never
	: never;

/**
 * Type helper to extract the headers parameter type for auth.api.signOut.
 *
 * @pure
 * @description Server sign-out requires Headers to access session cookies for termination.
 * Without headers, the server cannot identify which session to invalidate.
 *
 * @example
 * ```typescript
 * import { headers } from 'next/headers';
 *
 * const requestHeaders: SignOutServerHeaders = await headers();
 * ```
 */
export type SignOutServerHeaders = Headers;

/**
 * Type helper for the complete parameter structure accepted by signOut service.
 *
 * @pure
 * @description Unlike sign-in/sign-up, signOut does not require a body parameter.
 * Only headers are needed to identify the session cookie.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @remarks
 * - headers: Required Headers for accessing session cookies
 * - asResponse: Optional flag to return full Response object
 * - returnHeaders: Optional flag to include response headers in result
 *
 * @example
 * ```typescript
 * const params: SignOutServerParams<typeof authServer> = {
 *   headers: await headers()
 * };
 * ```
 */
export type SignOutServerParams<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = {
	headers: SignOutServerHeaders;
	asResponse?: boolean;
	returnHeaders?: boolean;
};

/**
 * Type helper to extract the result type from auth.api.signOut.
 *
 * @pure
 * @description Extracts the resolved Promise return type from the server API method.
 * Typically returns success confirmation or void.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Result = SignOutServerResult<typeof authServer>;
 * // { success: true } | void
 * ```
 */
export type SignOutServerResult<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = Awaited<
	ReturnType<AuthServerSignOutFor<T>>
>;

/**
 * Function signature for signOut server service.
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
 * 2. Accept params (headers) → Return Effect
 * 3. Effect executes lazily when run
 *
 * **Error Channel:**
 * - EmailAuthServerApiError: API call failures (e.g., invalid session, expired token)
 * - Other EmailAuthServerError types from validation layers (if using controller)
 *
 * @example
 * ```typescript
 * import { Effect } from 'effect';
 * import { signOutServer } from './signOut.service.js';
 *
 * const program = Effect.gen(function* () {
 *   yield* signOutServer({ authServer })({
 *     headers: requestHeaders
 *   });
 *
 *   console.log('User signed out successfully');
 * });
 *
 * await Effect.runPromise(program);
 * ```
 */
export interface signOutServerProps<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> {
	(deps: EmailAuthServerDeps<T>): (params: SignOutServerParams<T>) => Effect.Effect<SignOutServerResult<T>, EmailAuthServerError>;
}
