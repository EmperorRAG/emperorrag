/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/sign-up-email/signUpEmail.types.ts
 * @description Type definitions for server-side sign-up email operation.
 */

import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from '../../../server.types';
import type { CoreAuthServerError } from '../../shared/core.error';
import type { EmailAuthServerService } from '../shared/email.types';
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
 * type SignUpMethod = AuthServerApiSignUpEmailPropsFor<typeof authServer>;
 * // (args: { body: { email: string, password: string, name?: string }, headers?: Headers, ... }) => Promise<Session>
 *
 * // Usage in implementation
 * const signUp: AuthServerApiSignUpEmailPropsFor = authServer.api.signUpEmail;
 * const session = await signUp({
 *   body: { email: 'newuser@example.com', password: 'secret', name: 'John Doe' },
 *   headers: request.headers
 * });
 * ```
 */
export type AuthServerApiSignUpEmailPropsFor<T extends AuthServerFor = AuthServerFor> =
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
 * type Input = AuthServerApiSignUpEmailParamsFor<typeof authServer>;
 * // { body: { name: string, email: string, password: string, ... }, headers?: Headers, asResponse?: boolean, ... }
 * ```
 */
export type AuthServerApiSignUpEmailParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<AuthServerApiSignUpEmailPropsFor<T>>[0];

/**
 * Type helper to extract the return type from auth.api.signUpEmail.
 *
 * @pure
 * @description Extracts the Promise return type from the server API method.
 * The Promise resolves to newly created user data, session information, and plugin-added fields.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Result = AuthServerApiSignUpEmailResultFor<typeof authServer>;
 * // Promise<{ user: { id: string, name: string, email: string, ... }, session: { id: string, ... }, ... }>
 * ```
 */
export type AuthServerApiSignUpEmailResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<AuthServerApiSignUpEmailPropsFor<T>>;

/**
 * Function signature for signUpEmail server service.
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
 * import { signUpEmailServer } from './signUpEmail.service';
 *
 * const program = signUpEmailServer({
 *   body: {
 *     name: 'Jane Smith',
 *     email: 'jane@example.com',
 *     password: 'securePassword123'
 *   },
 *   headers: requestHeaders
 * });
 *
 * // Provide context and run
 * await Effect.runPromise(
 *   program.pipe(Effect.provideService(EmailAuthServerService, { authServer }))
 * );
 * ```
 */
// export interface signUpEmailPropsFor<T extends AuthServerFor = AuthServerFor> {
// 	(
// 		deps: EmailAuthServerDeps<T>
// 	): (params: AuthServerApiSignUpEmailParamsFor<T>) => Effect.Effect<Awaited<AuthServerApiSignUpEmailResultFor<T>>, CoreAuthServerError>;
// }
export interface signUpEmailPropsFor<T extends AuthServerFor = AuthServerFor> {
	(params: AuthServerApiSignUpEmailParamsFor<T>): Effect.Effect<Awaited<AuthServerApiSignUpEmailResultFor<T>>, CoreAuthServerError, EmailAuthServerService>;
}

/**
 * Type guard for validating AuthServerApiSignUpEmailParamsFor.
 *
 * @pure
 * @description Narrows an unknown value to AuthServerApiSignUpEmailParamsFor<T> by checking
 * the required structural properties. Use after Zod validation to provide type narrowing
 * without casting.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param value - The value to check
 * @returns True if value conforms to AuthServerApiSignUpEmailParamsFor<T> structure
 */
export const isAuthServerApiSignUpEmailParamsFor = <T extends AuthServerFor = AuthServerFor>(value: unknown): value is AuthServerApiSignUpEmailParamsFor<T> => {
	if (typeof value !== 'object' || value === null) return false;
	const obj = value as Record<string, unknown>;

	if (typeof obj.body !== 'object' || obj.body === null) return false;
	const body = obj.body as Record<string, unknown>;

	if (typeof body.name !== 'string') return false;
	if (typeof body.email !== 'string') return false;
	if (typeof body.password !== 'string') return false;

	return true;
};
