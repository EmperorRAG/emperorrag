/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/sign-out/signOut.types.ts
 * @description Type definitions for server-side sign-out operation.
 */

import type * as Effect from "effect/Effect";
import type { AuthServerError } from "../../../../errors/authServer.error";
import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from "../../../server.types";

/**
 * Type helper to extract the signOut endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `signOut` method from the server API. This method terminates
 * user sessions by invalidating session cookies and clearing authentication state.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type SignOutMethod = AuthServerApiSignOutPropsFor<typeof authServer>;
 * // (args: { headers: Headers, ... }) => Promise<{ success: boolean }>
 *
 * // Usage in implementation
 * const signOut: AuthServerApiSignOutPropsFor = authServer.api.signOut;
 * await signOut({ headers: request.headers });
 * ```
 */
export type AuthServerApiSignOutPropsFor<
  T extends AuthServerFor = AuthServerFor,
> = "signOut" extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>["signOut"]
  : never;

/**
 * Type helper to extract the input parameter type for auth.api.signOut.
 *
 * @pure
 * @description Extracts the first parameter type from the signOut method.
 * Requires headers for session cookie access; body is not needed for sign-out.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Input = AuthServerApiSignOutParamsFor<typeof authServer>;
 * // { headers: Headers, asResponse?: boolean, returnHeaders?: boolean }
 * ```
 */
export type AuthServerApiSignOutParamsFor<
  T extends AuthServerFor = AuthServerFor,
> = Parameters<AuthServerApiSignOutPropsFor<T>>[0];

/**
 * Type helper to extract the return type from auth.api.signOut.
 *
 * @pure
 * @description Extracts the Promise return type from the server API method.
 * Typically returns success confirmation or void upon session termination.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @example
 * ```typescript
 * type Result = AuthServerApiSignOutResultFor<typeof authServer>;
 * // Promise<{ success: boolean } | void>
 * ```
 */
export type AuthServerApiSignOutResultFor<
  T extends AuthServerFor = AuthServerFor,
> = ReturnType<AuthServerApiSignOutPropsFor<T>>;

/**
 * Function signature for signOut server service.
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
 * import { signOutServerService } from './signOut.service';
 *
 * const program = signOutServerService({
 *   headers: requestHeaders
 * });
 *
 * // Provide context and run
 * await Effect.runPromise(
 *   program.pipe(Effect.provideService(AuthServerTag, authServer))
 * );
 * ```
 */
export interface signOutPropsFor<T extends AuthServerFor = AuthServerFor> {
  (
    params: AuthServerApiSignOutParamsFor<T>,
  ): Effect.Effect<
    Awaited<AuthServerApiSignOutResultFor<T>>,
    AuthServerError,
    T
  >;
}

/**
 * Type guard for validating AuthServerApiSignOutParamsFor.
 *
 * @pure
 * @description Narrows an unknown value to AuthServerApiSignOutParamsFor<T> by checking
 * the required structural properties. Use after Zod validation to provide type narrowing
 * without casting.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param value - The value to check
 * @returns True if value conforms to AuthServerApiSignOutParamsFor<T> structure
 */
export const isAuthServerApiSignOutParamsFor = (
  value: unknown,
): value is AuthServerApiSignOutParamsFor<T> => {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;

  if (!(obj.headers instanceof Headers)) return false;

  return true;
};
