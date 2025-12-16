/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/callback-oauth/callbackOAuth.types.ts
 * @description Type definitions for server-side OAuth callback operation.
 */

import type * as Effect from "effect/Effect";
import type { AuthServerError } from "../../../../errors/authServer.error";
import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from "../../../server.types";

export type AuthServerApiCallbackOAuthPropsFor<T extends AuthServerFor = AuthServerFor> = "callbackOAuth" extends
  AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>["callbackOAuth"] : never;

export type AuthServerApiCallbackOAuthParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<
  AuthServerApiCallbackOAuthPropsFor<T>
>[0];

export type AuthServerApiCallbackOAuthResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<
  AuthServerApiCallbackOAuthPropsFor<T>
>;

export interface CallbackOAuthPropsFor<T extends AuthServerFor = AuthServerFor> {
  (
    params: AuthServerApiCallbackOAuthParamsFor<T>,
  ): Effect.Effect<Awaited<AuthServerApiCallbackOAuthResultFor<T>>, AuthServerError, T>;
}

export const isAuthServerApiCallbackOAuthParamsFor = (
  value: unknown,
): value is AuthServerApiCallbackOAuthParamsFor<T> => {
  if (typeof value !== "object" || value === null) return false;
  return true;
};
