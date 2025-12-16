/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-session/revokeSession.ts
 * @description Barrel export for server-side revoke session module.
 */

export { revokeSessionServerController } from "./revokeSession.controller";
export { revokeSessionServerService } from "./revokeSession.service";
export {
  type AuthServerApiRevokeSessionParamsFor,
  type AuthServerApiRevokeSessionPropsFor,
  type AuthServerApiRevokeSessionResultFor,
  isAuthServerApiRevokeSessionParamsFor,
  type revokeSessionPropsFor,
} from "./revokeSession.types";
