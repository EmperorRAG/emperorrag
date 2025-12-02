/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/sign-up-email/signUpEmail.types.ts
 * @description Type definitions for server-side sign-up email operation.
 */

import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from '../../../server.types';
import type { EmailAuthServerError } from '../shared/email.error';
import type { EmailAuthServerDeps } from '../shared/email.types';
import type * as Effect from 'effect/Effect';

/**
 * Type helper to extract the signUp endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `signUpEmail` method from the server API. This method creates
 * new user accounts with email and password, optionally including name and other fields, returning
 * session data or throwing an APIError on failure.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type SignUpMethod = SignUpEmailServerFor<typeof authServer>;
 * // (args: { body: { email: string, password: string, name?: string }, headers?: Headers, ... }) => Promise<Session>
 *
 * // Usage in implementation
 * const signUp: SignUpEmailServerFor = authServer.api.signUpEmail;
 * const session = await signUp({
 *   body: { email: 'newuser@example.com', password: 'secret', name: 'John Doe' },
 *   headers: request.headers
 * });
 * ```
 */
export type SignUpEmailServerFor<T extends AuthServerFor = AuthServerFor> =
	'signUpEmail' extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>['signUpEmail'] : never;

/**
 * Type helper to extract the input parameter type for auth.api.signUpEmail.
 *
 * @pure
 * @description Extracts the first parameter type from the signUpEmail method.
 * Includes user registration data: name, email, password, headers, and optional fields.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Input = SignUpEmailServerInput<typeof authServer>;
 * // { body: { name: string, email: string, password: string, ... }, headers?: Headers, asResponse?: boolean, ... }
 * ```
 */
export type SignUpEmailServerInput<T extends AuthServerFor = AuthServerFor> = Parameters<SignUpEmailServerFor<T>>[0];

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
export type SignUpEmailServerResult<T extends AuthServerFor = AuthServerFor> = Awaited<ReturnType<SignUpEmailServerFor<T>>>;

/**
 * Function signature for signUpEmail server service.
 *
 * @pure
 * @description Curried function accepting dependencies first, then input, returning an Effect.
 * Follows the same pattern as signInEmail for consistency.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @remarks
 * **Currying Stages:**
 * 1. Accept dependencies (authServer) → Return function accepting input
 * 2. Accept input (body, headers, etc.) → Return Effect
 * 3. Effect executes lazily when run
 *
 * **Error Channel:**
 * - EmailAuthServerApiError: API call failures with HTTP status codes
 * - Other EmailAuthServerError types from validation layers (if using controller)
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { signUpEmailServer } from './signUpEmail.service';
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
export interface signUpEmailServerProps<T extends AuthServerFor = AuthServerFor> {
	(deps: EmailAuthServerDeps<T>): (input: SignUpEmailServerInput<T>) => Effect.Effect<SignUpEmailServerResult<T>, EmailAuthServerError>;
}
