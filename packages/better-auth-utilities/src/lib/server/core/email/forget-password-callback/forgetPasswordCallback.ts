/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/forget-password-callback/forgetPasswordCallback.ts
 * @description Barrel export for server-side forget password callback module.
 */

export { forgetPasswordCallbackServerController } from "./forgetPasswordCallback.controller";
export { forgetPasswordCallbackServerService } from "./forgetPasswordCallback.service";
export {
  type AuthServerApiForgetPasswordCallbackParamsFor,
  type AuthServerApiForgetPasswordCallbackPropsFor,
  type AuthServerApiForgetPasswordCallbackResultFor,
  type forgetPasswordCallbackPropsFor,
  isAuthServerApiForgetPasswordCallbackParamsFor,
} from "./forgetPasswordCallback.types";
