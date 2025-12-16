/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/get-access-token/getAccessToken.types.ts
 * @description Type definitions for server-side get access token operation.
 */

import type * as Effect from "effect/Effect";
import type { AuthServerError } from "../../../../errors/authServer.error";
import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from "../../../server.types";

export type AuthServerApiGetAccessTokenPropsFor<T extends AuthServerFor = AuthServerFor> = "getAccessToken" extends
  AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>["getAccessToken"] : never;

export type AuthServerApiGetAccessTokenParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<
  AuthServerApiGetAccessTokenPropsFor<AuthServerFor>
>[0];

export type AuthServerApiGetAccessTokenResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<
  AuthServerApiGetAccessTokenPropsFor<AuthServerFor>
>;

export interface getAccessTokenPropsFor<T extends AuthServerFor = AuthServerFor> {
  (
    params: AuthServerApiGetAccessTokenParamsFor<AuthServerFor>,
  ): Effect.Effect<Awaited<AuthServerApiGetAccessTokenResultFor<AuthServerFor>>, AuthServerError, AuthServerFor>;
}

export const isAuthServerApiGetAccessTokenParamsFor = (
  value: unknown,
): value is AuthServerApiGetAccessTokenParamsFor<AuthServerFor> => {
  if (typeof value !== "object" || value === null) return false;
  return true;
};
