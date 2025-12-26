/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/get-session/getSession.ts
 * @description Barrel export for server-side getSession module.
 * Re-exports all public APIs for the getSession operation.
 */

export { getSessionServerController } from "./getSession.controller";
export { getSessionServerService } from "./getSession.service";
export {
  type AuthServerApiGetSessionParamsFor,
  type AuthServerApiGetSessionPropsFor,
  type AuthServerApiGetSessionResultFor,
  type getSessionPropsFor,
  isAuthServerApiGetSessionParamsFor,
} from "./getSession.types";
