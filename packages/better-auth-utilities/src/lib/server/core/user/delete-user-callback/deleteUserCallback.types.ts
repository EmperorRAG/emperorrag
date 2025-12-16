/**
 * @file libs/better-auth-utilities/src/lib/server/core/user/delete-user-callback/deleteUserCallback.types.ts
 * @description Type definitions for server-side delete user callback operation.
 */

import type * as Effect from "effect/Effect";
import type { AuthServerError } from "../../../../errors/authServer.error";
import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from "../../../server.types";

export type AuthServerApiDeleteUserCallbackPropsFor<T extends AuthServerFor = AuthServerFor> =
  "deleteUserCallback" extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>["deleteUserCallback"] : never;

export type AuthServerApiDeleteUserCallbackParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<
  AuthServerApiDeleteUserCallbackPropsFor<T>
>[0];

export type AuthServerApiDeleteUserCallbackResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<
  AuthServerApiDeleteUserCallbackPropsFor<T>
>;

export interface DeleteUserCallbackPropsFor<T extends AuthServerFor = AuthServerFor> {
  (
    params: AuthServerApiDeleteUserCallbackParamsFor<T>,
  ): Effect.Effect<Awaited<AuthServerApiDeleteUserCallbackResultFor<T>>, AuthServerError, T>;
}

export const isAuthServerApiDeleteUserCallbackParamsFor = (
  value: unknown,
): value is AuthServerApiDeleteUserCallbackParamsFor<T> => {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  if (typeof obj["query"] !== "object" || obj["query"] === null) return false;
  const query = obj["query"] as Record<string, unknown>;
  if (typeof query["token"] !== "string" || query["token"].length === 0) return false;
  return true;
};
