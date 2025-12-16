/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-session/revokeSession.types.ts
 * @description Type definitions for server-side revoke session operation.
 */

import type * as Effect from "effect/Effect";
import type { AuthServerError } from "../../../../errors/authServer.error";
import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from "../../../server.types";

/**
 * Type helper to extract the revokeSession endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `revokeSession` method from the server API.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export type AuthServerApiRevokeSessionPropsFor<T extends AuthServerFor = AuthServerFor> = "revokeSession" extends
  AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>["revokeSession"] : never;

/**
 * Type helper to extract the input parameter type for auth.api.revokeSession.
 *
 * @pure
 * @description Extracts the first parameter type from the revokeSession method.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export type AuthServerApiRevokeSessionParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<
  AuthServerApiRevokeSessionPropsFor<T>
>[0];

/**
 * Type helper to extract the return type from auth.api.revokeSession.
 *
 * @pure
 * @description Extracts the Promise return type from the server API method.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export type AuthServerApiRevokeSessionResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<
  AuthServerApiRevokeSessionPropsFor<T>
>;

/**
 * Function signature for revokeSession server service.
 *
 * @pure
 * @description Function accepting input parameters, returning an Effect that requires AuthServerFor context.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export interface RevokeSessionPropsFor<T extends AuthServerFor = AuthServerFor> {
  (
    params: AuthServerApiRevokeSessionParamsFor<T>,
  ): Effect.Effect<Awaited<AuthServerApiRevokeSessionResultFor<T>>, AuthServerError, T>;
}

/**
 * Type guard for validating AuthServerApiRevokeSessionParamsFor.
 *
 * @pure
 * @description Narrows an unknown value to AuthServerApiRevokeSessionParamsFor<T>.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param value - The value to check
 * @returns True if value conforms to AuthServerApiRevokeSessionParamsFor<T> structure
 */
export const isAuthServerApiRevokeSessionParamsFor = (
  value: unknown,
): value is AuthServerApiRevokeSessionParamsFor<T> => {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;

  if (typeof obj.body !== "object" || obj.body === null) return false;
  const body = obj.body as Record<string, unknown>;

  if (typeof body.token !== "string") return false;

  return true;
};
