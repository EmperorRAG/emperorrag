/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/refresh-token/refreshToken.types.ts
 * @description Type definitions for server-side refresh token operation.
 */

import type * as Effect from "effect/Effect";
import type { AuthServerError } from "../../../../errors/authServer.error";
import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from "../../../server.types";

export type AuthServerApiRefreshTokenPropsFor<
  T extends AuthServerFor = AuthServerFor,
> = "refreshToken" extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>["refreshToken"]
  : never;

export type AuthServerApiRefreshTokenParamsFor<
  T extends AuthServerFor = AuthServerFor,
> = Parameters<AuthServerApiRefreshTokenPropsFor<T>>[0];

export type AuthServerApiRefreshTokenResultFor<
  T extends AuthServerFor = AuthServerFor,
> = ReturnType<AuthServerApiRefreshTokenPropsFor<T>>;

export interface RefreshTokenPropsFor<T extends AuthServerFor = AuthServerFor> {
  (
    params: AuthServerApiRefreshTokenParamsFor<T>,
  ): Effect.Effect<
    Awaited<AuthServerApiRefreshTokenResultFor<T>>,
    AuthServerError,
    T
  >;
}

export const isAuthServerApiRefreshTokenParamsFor = (
  value: unknown,
): value is AuthServerApiRefreshTokenParamsFor<T> => {
  if (typeof value !== "object" || value === null) return false;
  return true;
};
