/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/sign-in-email/signInEmail.types.ts
 * @description Type definitions for server-side sign-in email operation.
 */

import type { betterAuth } from 'better-auth';
import type { AuthServerFor, AuthServerSignInFor } from '../../../../server/server.types.js';
import type { EmailAuthServerError } from '../shared/email.error.js';
import type { EmailAuthServerDeps } from '../shared/email.types.js';
import type { Effect } from 'effect';

/**
 * Type helper to extract the body parameter type for auth.api.signInEmail.
 *
 * @pure
 * @description Extracts the 'body' property type from the first parameter of signInEmail.
 * Server APIs wrap parameters in { body, headers, query, asResponse, returnHeaders } structure.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Body = SignInEmailServerInput<typeof authServer>;
 * // { email: string, password: string, rememberMe?: boolean, callbackURL?: string }
 * ```
 */
export type SignInEmailServerInput<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = Parameters<
	AuthServerSignInFor<T>
>[0] extends { body: infer B }
	? B
	: never;

/**
 * Type helper to extract the headers parameter type for auth.api.signInEmail.
 *
 * @pure
 * @description Server operations accept Headers for session cookie handling and authentication.
 *
 * @example
 * ```typescript
 * import { headers } from 'next/headers';
 *
 * const requestHeaders: SignInEmailServerHeaders = await headers();
 * ```
 */
export type SignInEmailServerHeaders = Headers;

/**
 * Type helper for the complete parameter structure accepted by signInEmail service.
 *
 * @pure
 * @description Combines body, headers, and Better Auth server options into a single type.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @remarks
 * - body: Required authentication credentials (email, password, etc.)
 * - headers: Optional Headers for session cookie handling (recommended for session creation)
 * - asResponse: Optional flag to return full Response object instead of parsed data
 * - returnHeaders: Optional flag to include response headers in result
 *
 * @example
 * ```typescript
 * const params: SignInEmailServerParams<typeof authServer> = {
 *   body: {
 *     email: 'user@example.com',
 *     password: 'securePassword123',
 *     rememberMe: true
 *   },
 *   headers: await headers()
 * };
 * ```
 */
export type SignInEmailServerParams<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = {
	body: SignInEmailServerInput<T>;
	headers?: SignInEmailServerHeaders;
	asResponse?: boolean;
	returnHeaders?: boolean;
};

/**
 * Type helper to extract the result type from auth.api.signInEmail.
 *
 * @pure
 * @description Extracts the resolved Promise return type from the server API method.
 * Typically includes user data, session information, and any plugin-added fields.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Result = SignInEmailServerResult<typeof authServer>;
 * // { user: { id: string, email: string, ... }, session: { id: string, ... }, ... }
 * ```
 */
export type SignInEmailServerResult<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = Awaited<
	ReturnType<AuthServerSignInFor<T>>
>;

/**
 * Function signature for signInEmail server service.
 *
 * @pure
 * @description Curried function accepting dependencies first, then parameters, returning an Effect.
 * This pattern enables clean dependency injection and testability.
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
 * - EmailAuthServerApiError: API call failures with HTTP status codes
 * - Other EmailAuthServerError types from validation layers (if using controller)
 *
 * @example
 * ```typescript
 * import { Effect } from 'effect';
 * import { signInEmailServer } from './signInEmail.service.js';
 *
 * const program = Effect.gen(function* () {
 *   const result = yield* signInEmailServer({ authServer })({
 *     body: {
 *       email: 'user@example.com',
 *       password: 'securePassword123'
 *     },
 *     headers: requestHeaders
 *   });
 *
 *   console.log('Signed in:', result.user.email);
 *   return result;
 * });
 *
 * // Execute the Effect
 * await Effect.runPromise(program);
 * ```
 */
export interface signInEmailServerProps<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> {
	(deps: EmailAuthServerDeps<T>): (params: SignInEmailServerParams<T>) => Effect.Effect<SignInEmailServerResult<T>, EmailAuthServerError>;
}
