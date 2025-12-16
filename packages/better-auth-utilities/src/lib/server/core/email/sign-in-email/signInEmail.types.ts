/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/sign-in-email/signInEmail.types.ts
 * @description Type definitions for server-side sign-in email operation.
 */

import type * as Effect from "effect/Effect";
import type { AuthServerError } from "../../../../errors/authServer.error";
import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from "../../../server.types";

/**
 * Type helper to extract the signInEmail endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `signInEmail` method from the server API. This method authenticates
 * users with email and password, creating a session and returning user data on success.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type SignInMethod = AuthServerApiSignInEmailPropsFor<typeof authServer>;
 * // (args: { body: { email: string, password: string, ... }, headers?: Headers, ... }) => Promise<Session>
 *
 * // Usage in implementation
 * const signIn: AuthServerApiSignInEmailPropsFor = authServer.api.signInEmail;
 * const session = await signIn({
 *   body: { email: 'user@example.com', password: 'secret' },
 *   headers: request.headers
 * });
 * ```
 */
export type AuthServerApiSignInEmailPropsFor<T extends AuthServerFor = AuthServerFor> = "signInEmail" extends
  AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>["signInEmail"] : never;

/**
 * Type helper to extract the input parameter type for auth.api.signInEmail.
 *
 * @pure
 * @description Extracts the first parameter type from the signInEmail method.
 * Includes authentication credentials: email, password, rememberMe, headers, and optional fields.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Input = AuthServerApiSignInEmailParamsFor<typeof authServer>;
 * // { body: { email: string, password: string, rememberMe?: boolean, ... }, headers?: Headers, asResponse?: boolean, ... }
 * ```
 */
export type AuthServerApiSignInEmailParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<
  AuthServerApiSignInEmailPropsFor<AuthServerFor>
>[0];

/**
 * Type helper to extract the return type from auth.api.signInEmail.
 *
 * @pure
 * @description Extracts the Promise return type from the server API method.
 * The Promise resolves to user data, session information, and plugin-added fields.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Result = AuthServerApiSignInEmailResultFor<typeof authServer>;
 * // Promise<{ user: { id: string, email: string, ... }, session: { id: string, ... }, ... }>
 * ```
 */
export type AuthServerApiSignInEmailResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<
  AuthServerApiSignInEmailPropsFor<AuthServerFor>
>;

/**
 * Function signature for signInEmail server service.
 *
 * @pure
 * @description Function accepting input parameters, returning an Effect that requires AuthServerFor context.
 * Dependencies are accessed through Effect's context layer rather than curried function arguments.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @remarks
 * **Context-Based Dependency Injection:**
 * - Dependencies (authServer) are provided via Effect's context layer (AuthServerFor)
 * - Function accepts only the API parameters directly
 * - Effect executes lazily when run with provided context
 *
 * **Error Channel:**
 * - AuthServerApiError: API call failures with HTTP status codes
 * - Other AuthServerError types from validation layers (if using controller)
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { signInEmailServerService } from './signInEmail.service';
 *
 * const program = signInEmailServerService({
 *   body: {
 *     email: 'user@example.com',
 *     password: 'securePassword123'
 *   },
 *   headers: requestHeaders
 * });
 *
 * // Provide context and run
 * await Effect.runPromise(
 *   program.pipe(Effect.provideService(AuthServerTag, authServer))
 * );
 * ```
 */
export interface signInEmailPropsFor<T extends AuthServerFor = AuthServerFor> {
  (
    params: AuthServerApiSignInEmailParamsFor<AuthServerFor>,
  ): Effect.Effect<Awaited<AuthServerApiSignInEmailResultFor<AuthServerFor>>, AuthServerError, AuthServerFor>;
}

/**
 * Type guard for validating AuthServerApiSignInEmailParamsFor.
 *
 * @pure
 * @description Narrows an unknown value to AuthServerApiSignInEmailParamsFor<AuthServerFor> by checking
 * the required structural properties. Use after Zod validation to provide type narrowing
 * without casting.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param value - The value to check
 * @returns True if value conforms to AuthServerApiSignInEmailParamsFor<AuthServerFor> structure
 */
export const isAuthServerApiSignInEmailParamsFor = (
  value: unknown,
): value is AuthServerApiSignInEmailParamsFor<AuthServerFor> => {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;

  if (typeof obj.body !== "object" || obj.body === null) return false;
  const body = obj.body as Record<string, unknown>;

  if (typeof body.email !== "string") return false;
  if (typeof body.password !== "string") return false;

  return true;
};
