/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/set-password/setPassword.types.ts
 * @description Type definitions for server-side set password operation.
 */

import type * as Effect from "effect/Effect";
import type { AuthServerError } from "../../../../errors/authServer.error";
import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from "../../../server.types";

/**
 * Type helper to extract the setPassword endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `setPassword` method from the server API. This method
 * allows users to set a password (typically for OAuth-only accounts).
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export type AuthServerApiSetPasswordPropsFor<
  T extends AuthServerFor = AuthServerFor,
> = "setPassword" extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>["setPassword"]
  : never;

/**
 * Type helper to extract the input parameter type for auth.api.setPassword.
 *
 * @pure
 * @description Extracts the first parameter type from the setPassword method.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export type AuthServerApiSetPasswordParamsFor<
  T extends AuthServerFor = AuthServerFor,
> = Parameters<AuthServerApiSetPasswordPropsFor<T>>[0];

/**
 * Type helper to extract the return type from auth.api.setPassword.
 *
 * @pure
 * @description Extracts the Promise return type from the server API method.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export type AuthServerApiSetPasswordResultFor<
  T extends AuthServerFor = AuthServerFor,
> = ReturnType<AuthServerApiSetPasswordPropsFor<T>>;

/**
 * Function signature for setPassword server service.
 *
 * @pure
 * @description Function accepting input parameters, returning an Effect that requires AuthServerFor context.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export interface SetPasswordPropsFor<T extends AuthServerFor = AuthServerFor> {
  (
    params: AuthServerApiSetPasswordParamsFor<T>,
  ): Effect.Effect<
    Awaited<AuthServerApiSetPasswordResultFor<T>>,
    AuthServerError,
    T
  >;
}

/**
 * Type guard for validating AuthServerApiSetPasswordParamsFor.
 *
 * @pure
 * @description Narrows an unknown value to AuthServerApiSetPasswordParamsFor<T> by checking
 * the required structural properties.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param value - The value to check
 * @returns True if value conforms to AuthServerApiSetPasswordParamsFor<T> structure
 */
export const isAuthServerApiSetPasswordParamsFor = (
  value: unknown,
): value is AuthServerApiSetPasswordParamsFor<T> => {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;

  if (typeof obj.body !== "object" || obj.body === null) return false;
  const body = obj.body as Record<string, unknown>;

  if (typeof body.newPassword !== "string") return false;

  return true;
};
