/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/change-email/changeEmail.types.ts
 * @description Type definitions for server-side change email operation.
 */

import type * as Effect from "effect/Effect";
import type { AuthServerError } from "../../../../errors/authServer.error";
import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from "../../../server.types";

/**
 * Type helper to extract the changeEmail endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `changeEmail` method from the server API. This method
 * allows users to change their email address.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export type AuthServerApiChangeEmailPropsFor<T extends AuthServerFor = AuthServerFor> = "changeEmail" extends
  AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>["changeEmail"] : never;

/**
 * Type helper to extract the input parameter type for auth.api.changeEmail.
 *
 * @pure
 * @description Extracts the first parameter type from the changeEmail method.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export type AuthServerApiChangeEmailParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<
  AuthServerApiChangeEmailPropsFor<T>
>[0];

/**
 * Type helper to extract the return type from auth.api.changeEmail.
 *
 * @pure
 * @description Extracts the Promise return type from the server API method.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export type AuthServerApiChangeEmailResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<
  AuthServerApiChangeEmailPropsFor<T>
>;

/**
 * Function signature for changeEmail server service.
 *
 * @pure
 * @description Function accepting input parameters, returning an Effect that requires AuthServerFor context.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export interface ChangeEmailPropsFor<T extends AuthServerFor = AuthServerFor> {
  (
    params: AuthServerApiChangeEmailParamsFor<T>,
  ): Effect.Effect<Awaited<AuthServerApiChangeEmailResultFor<T>>, AuthServerError, T>;
}

/**
 * Type guard for validating AuthServerApiChangeEmailParamsFor.
 *
 * @pure
 * @description Narrows an unknown value to AuthServerApiChangeEmailParamsFor<T> by checking
 * the required structural properties.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param value - The value to check
 * @returns True if value conforms to AuthServerApiChangeEmailParamsFor<T> structure
 */
export const isAuthServerApiChangeEmailParamsFor = (
  value: unknown,
): value is AuthServerApiChangeEmailParamsFor<T> => {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;

  if (typeof obj.body !== "object" || obj.body === null) return false;
  const body = obj.body as Record<string, unknown>;

  if (typeof body.newEmail !== "string") return false;

  return true;
};
