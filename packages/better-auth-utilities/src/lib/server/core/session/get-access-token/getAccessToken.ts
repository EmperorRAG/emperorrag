/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/get-access-token/getAccessToken.ts
 * @description Barrel export for server-side get access token module.
 */

export { getAccessTokenServerController } from "./getAccessToken.controller";
export { getAccessTokenServerService } from "./getAccessToken.service";
export {
  type AuthServerApiGetAccessTokenParamsFor,
  type AuthServerApiGetAccessTokenPropsFor,
  type AuthServerApiGetAccessTokenResultFor,
  type getAccessTokenPropsFor,
  isAuthServerApiGetAccessTokenParamsFor,
} from "./getAccessToken.types";
