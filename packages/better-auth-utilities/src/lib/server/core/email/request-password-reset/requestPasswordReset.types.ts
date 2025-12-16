/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/request-password-reset/requestPasswordReset.types.ts
 * @description Type definitions for server-side request password reset operation.
 */

import type * as Effect from "effect/Effect";
import type { AuthServerError } from "../../../../errors/authServer.error";
import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from "../../../server.types";

export type AuthServerApiRequestPasswordResetPropsFor<T extends AuthServerFor = AuthServerFor> =
  "requestPasswordReset" extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>["requestPasswordReset"] : never;

export type AuthServerApiRequestPasswordResetParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<
  AuthServerApiRequestPasswordResetPropsFor<T>
>[0];

export type AuthServerApiRequestPasswordResetResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<
  AuthServerApiRequestPasswordResetPropsFor<T>
>;

export interface RequestPasswordResetPropsFor<T extends AuthServerFor = AuthServerFor> {
  (
    params: AuthServerApiRequestPasswordResetParamsFor<T>,
  ): Effect.Effect<Awaited<AuthServerApiRequestPasswordResetResultFor<T>>, AuthServerError, T>;
}

export const isAuthServerApiRequestPasswordResetParamsFor = (
  value: unknown,
): value is AuthServerApiRequestPasswordResetParamsFor<T> => {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  if (typeof obj["body"] !== "object" || obj["body"] === null) return false;
  const body = obj["body"] as Record<string, unknown>;
  if (typeof body["email"] !== "string" || body["email"].length === 0) return false;
  return true;
};
