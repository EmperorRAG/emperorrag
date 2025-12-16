/**
 * @file libs/better-auth-utilities/src/lib/core/user/server/update-user/updateUser.types.ts
 * @description Type definitions for server-side update user operation.
 */

import type * as Effect from "effect/Effect";
import type { AuthServerError } from "../../../../errors/authServer.error";
import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from "../../../server.types";

/**
 * Type helper to extract the updateUser endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `updateUser` method from the server API. This method updates
 * user profile information like name, email, and image, returning the updated user data.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export type AuthServerApiUpdateUserPropsFor<T extends AuthServerFor = AuthServerFor> = "updateUser" extends
  AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>["updateUser"] : never;

/**
 * Type helper to extract the input parameter type for auth.api.updateUser.
 *
 * @pure
 * @description Extracts the first parameter type from the updateUser method.
 * Includes user update data: name, email, image, headers, and optional fields.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export type AuthServerApiUpdateUserParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<
  AuthServerApiUpdateUserPropsFor<T>
>[0];

/**
 * Type helper to extract the return type from auth.api.updateUser.
 *
 * @pure
 * @description Extracts the Promise return type from the server API method.
 * The Promise resolves to the updated user data and plugin-added fields.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 */
export type AuthServerApiUpdateUserResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<
  AuthServerApiUpdateUserPropsFor<T>
>;

/**
 * Function signature for updateUser server service.
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
 */
export interface UpdateUserPropsFor<T extends AuthServerFor = AuthServerFor> {
  (
    params: AuthServerApiUpdateUserParamsFor<T>,
  ): Effect.Effect<Awaited<AuthServerApiUpdateUserResultFor<T>>, AuthServerError, T>;
}

/**
 * Type guard for validating AuthServerApiUpdateUserParamsFor.
 *
 * @pure
 * @description Narrows an unknown value to AuthServerApiUpdateUserParamsFor<T> by checking
 * the required structural properties. Use after Zod validation to provide type narrowing
 * without casting.
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param value - The value to check
 * @returns True if value conforms to AuthServerApiUpdateUserParamsFor<T> structure
 */
export const isAuthServerApiUpdateUserParamsFor = (
  value: unknown,
): value is AuthServerApiUpdateUserParamsFor<T> => {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;

  if (typeof obj.body !== "object" || obj.body === null) return false;
  const body = obj.body as Record<string, unknown>;

  // updateUser requires at least one updatable field, but body structure must exist
  // Optional fields: name, email, image
  if (body.name !== undefined && typeof body.name !== "string") return false;
  if (body.email !== undefined && typeof body.email !== "string") return false;
  if (body.image !== undefined && body.image !== null && typeof body.image !== "string") return false;

  return true;
};
