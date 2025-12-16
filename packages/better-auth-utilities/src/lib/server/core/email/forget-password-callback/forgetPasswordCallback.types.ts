/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/forget-password-callback/forgetPasswordCallback.types.ts
 * @description Type definitions for server-side forget password callback operation.
 */

import type * as Effect from "effect/Effect";
import type { AuthServerError } from "../../../../errors/authServer.error";
import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from "../../../server.types";

export type AuthServerApiForgetPasswordCallbackPropsFor<T extends AuthServerFor = AuthServerFor> =
  "forgetPasswordCallback" extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>["forgetPasswordCallback"]
  : never;

export type AuthServerApiForgetPasswordCallbackParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<
  AuthServerApiForgetPasswordCallbackPropsFor<T>
>[0];

export type AuthServerApiForgetPasswordCallbackResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<
  AuthServerApiForgetPasswordCallbackPropsFor<T>
>;

export interface forgetPasswordCallbackPropsFor<T extends AuthServerFor = AuthServerFor> {
  (
    params: AuthServerApiForgetPasswordCallbackParamsFor<T>,
  ): Effect.Effect<
    Awaited<AuthServerApiForgetPasswordCallbackResultFor<T>>,
    AuthServerError,
    T
  >;
}

export const isAuthServerApiForgetPasswordCallbackParamsFor = (
  value: unknown,
): value is AuthServerApiForgetPasswordCallbackParamsFor<T> => {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  if (typeof obj["query"] !== "object" || obj["query"] === null) return false;
  const query = obj["query"] as Record<string, unknown>;
  if (typeof query["token"] !== "string" || query["token"].length === 0) return false;
  return true;
};
