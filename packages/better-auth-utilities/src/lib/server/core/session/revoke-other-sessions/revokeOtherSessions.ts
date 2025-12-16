/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-other-sessions/revokeOtherSessions.ts
 * @description Barrel export for server-side revoke other sessions module.
 */

export { revokeOtherSessionsServerController } from "./revokeOtherSessions.controller";
export { revokeOtherSessionsServerService } from "./revokeOtherSessions.service";
export {
  type AuthServerApiRevokeOtherSessionsParamsFor,
  type AuthServerApiRevokeOtherSessionsPropsFor,
  type AuthServerApiRevokeOtherSessionsResultFor,
  isAuthServerApiRevokeOtherSessionsParamsFor,
  type revokeOtherSessionsPropsFor,
} from "./revokeOtherSessions.types";
