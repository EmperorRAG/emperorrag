/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/callback-oauth/callbackOAuth.ts
 * @description Barrel export for server-side OAuth callback module.
 */

export { callbackOAuthServerController } from "./callbackOAuth.controller";
export { callbackOAuthServerService } from "./callbackOAuth.service";
export {
  type AuthServerApiCallbackOAuthParamsFor,
  type AuthServerApiCallbackOAuthPropsFor,
  type AuthServerApiCallbackOAuthResultFor,
  type callbackOAuthPropsFor,
  isAuthServerApiCallbackOAuthParamsFor,
} from "./callbackOAuth.types";
