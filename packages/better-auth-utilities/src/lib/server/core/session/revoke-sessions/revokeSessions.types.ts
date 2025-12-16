/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-sessions/revokeSessions.types.ts
 * @description Type definitions for server-side revoke all sessions operation.
 */

import type * as Effect from "effect/Effect";
import type { AuthServerError } from "../../../../errors/authServer.error";
import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from "../../../server.types";

export type AuthServerApiRevokeSessionsPropsFor<T extends AuthServerFor = AuthServerFor> = "revokeSessions" extends
  AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>["revokeSessions"] : never;

export type AuthServerApiRevokeSessionsParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<
  AuthServerApiRevokeSessionsPropsFor<T>
>[0];

export type AuthServerApiRevokeSessionsResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<
  AuthServerApiRevokeSessionsPropsFor<T>
>;

export interface RevokeSessionsPropsFor<T extends AuthServerFor = AuthServerFor> {
  (
    params: AuthServerApiRevokeSessionsParamsFor<T>,
  ): Effect.Effect<Awaited<AuthServerApiRevokeSessionsResultFor<T>>, AuthServerError, T>;
}

export const isAuthServerApiRevokeSessionsParamsFor = (
  value: unknown,
): value is AuthServerApiRevokeSessionsParamsFor<T> => {
  if (typeof value !== "object" || value === null) return false;
  return true;
};
