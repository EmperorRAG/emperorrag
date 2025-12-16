/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-sessions/revokeSessions.ts
 * @description Barrel export for server-side revoke all sessions module.
 */

export { revokeSessionsServerController } from "./revokeSessions.controller";
export { revokeSessionsServerService } from "./revokeSessions.service";
export {
  type AuthServerApiRevokeSessionsParamsFor,
  type AuthServerApiRevokeSessionsPropsFor,
  type AuthServerApiRevokeSessionsResultFor,
  isAuthServerApiRevokeSessionsParamsFor,
  type revokeSessionsPropsFor,
} from "./revokeSessions.types";
