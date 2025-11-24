/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/sign-up-email/signUpEmail.types.ts
 * @description Type definitions for server-side sign-up email operation.
 */

import type { betterAuth } from 'better-auth';
import type { AuthServerFor, AuthServerSignUpFor } from '../../../../server/server.types.js';
import type { EmailAuthServerError } from '../shared/email.error.js';
import type { EmailAuthServerDeps } from '../shared/email.types.js';
import type { Effect } from 'effect';

/**
 * Type helper to extract the body parameter type for auth.api.signUpEmail.
 *
 * @pure
 * @description Extracts the 'body' property type from the first parameter of signUpEmail.
 * Includes user registration data: name, email, password, and optional fields.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Body = SignUpEmailServerInput<typeof authServer>;
 * // { name: string, email: string, password: string, callbackURL?: string, image?: string }
 * ```
 */
export type SignUpEmailServerInput<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = Parameters<
	AuthServerSignUpFor<T>
>[0] extends { body: infer B }
	? B
	: never;

/**
 * Type helper to extract the headers parameter type for auth.api.signUpEmail.
 *
 * @pure
 * @description Server operations accept Headers for session cookie creation after registration.
 *
 * @example
 * ```typescript
 * import { headers } from 'next/headers';
 *
 * const requestHeaders: SignUpEmailServerHeaders = await headers();
 * ```
 */
export type SignUpEmailServerHeaders = Headers;

/**
 * Type helper for the complete parameter structure accepted by signUpEmail service.
 *
 * @pure
 * @description Combines body, headers, and Better Auth server options into a single type.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @remarks
 * - body: Required registration data (name, email, password, etc.)
 * - headers: Optional Headers for session cookie creation (recommended)
 * - asResponse: Optional flag to return full Response object instead of parsed data
 * - returnHeaders: Optional flag to include response headers in result
 *
 * @example
 * ```typescript
 * const params: SignUpEmailServerParams<typeof authServer> = {
 *   body: {
 *     name: 'John Doe',
 *     email: 'john@example.com',
 *     password: 'securePassword123',
 *     image: 'https://example.com/avatar.jpg'
 *   },
 *   headers: await headers()
 * };
 * ```
 */
export type SignUpEmailServerParams<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = {
	body: SignUpEmailServerInput<T>;
	headers?: SignUpEmailServerHeaders;
	asResponse?: boolean;
	returnHeaders?: boolean;
};

/**
 * Type helper to extract the result type from auth.api.signUpEmail.
 *
 * @pure
 * @description Extracts the resolved Promise return type from the server API method.
 * Includes newly created user data, session information, and plugin-added fields.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Result = SignUpEmailServerResult<typeof authServer>;
 * // { user: { id: string, name: string, email: string, ... }, session: { id: string, ... }, ... }
 * ```
 */
export type SignUpEmailServerResult<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> = Awaited<
	ReturnType<AuthServerSignUpFor<T>>
>;

/**
 * Function signature for signUpEmail server service.
 *
 * @pure
 * @description Curried function accepting dependencies first, then parameters, returning an Effect.
 * Follows the same pattern as signInEmail for consistency.
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
 * import * as Effect from 'effect/Effect';
 * import { signUpEmailServer } from './signUpEmail.service.js';
 *
 * const program = Effect.gen(function* () {
 *   const result = yield* signUpEmailServer({ authServer })({
 *     body: {
 *       name: 'Jane Smith',
 *       email: 'jane@example.com',
 *       password: 'securePassword123'
 *     },
 *     headers: requestHeaders
 *   });
 *
 *   console.log('User registered:', result.user.email);
 *   return result;
 * });
 *
 * await Effect.runPromise(program);
 * ```
 */
export interface signUpEmailServerProps<T extends AuthServerFor<ReturnType<typeof betterAuth>> = AuthServerFor<ReturnType<typeof betterAuth>>> {
	(deps: EmailAuthServerDeps<T>): (params: SignUpEmailServerParams<T>) => Effect.Effect<SignUpEmailServerResult<T>, EmailAuthServerError>;
}
