/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-other-sessions/revokeOtherSessions.types.ts
 * @description Type definitions for server-side revoke other sessions operation.
 */

import type * as Effect from "effect/Effect";
import type { AuthServerError } from "../../../../errors/authServer.error";
import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from "../../../server.types";

export type AuthServerApiRevokeOtherSessionsPropsFor<T extends AuthServerFor = AuthServerFor> =
  "revokeOtherSessions" extends AuthServerApiEndpointKeyFor<T> ? AuthServerApiFor<T>["revokeOtherSessions"] : never;

export type AuthServerApiRevokeOtherSessionsParamsFor<T extends AuthServerFor = AuthServerFor> = Parameters<
  AuthServerApiRevokeOtherSessionsPropsFor<T>
>[0];

export type AuthServerApiRevokeOtherSessionsResultFor<T extends AuthServerFor = AuthServerFor> = ReturnType<
  AuthServerApiRevokeOtherSessionsPropsFor<T>
>;

export interface RevokeOtherSessionsPropsFor<T extends AuthServerFor = AuthServerFor> {
  (
    params: AuthServerApiRevokeOtherSessionsParamsFor<T>,
  ): Effect.Effect<Awaited<AuthServerApiRevokeOtherSessionsResultFor<T>>, AuthServerError, T>;
}

export const isAuthServerApiRevokeOtherSessionsParamsFor = (
  value: unknown,
): value is AuthServerApiRevokeOtherSessionsParamsFor<T> => {
  if (typeof value !== "object" || value === null) return false;
  return true;
};
