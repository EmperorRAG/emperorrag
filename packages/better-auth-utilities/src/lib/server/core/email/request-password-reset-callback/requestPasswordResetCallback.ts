/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/request-password-reset-callback/requestPasswordResetCallback.ts
 * @description Barrel export for server-side request password reset callback module.
 */

export { requestPasswordResetCallbackServerController } from "./requestPasswordResetCallback.controller";
export { requestPasswordResetCallbackServerService } from "./requestPasswordResetCallback.service";
export {
  type AuthServerApiRequestPasswordResetCallbackParamsFor,
  type AuthServerApiRequestPasswordResetCallbackPropsFor,
  type AuthServerApiRequestPasswordResetCallbackResultFor,
  isAuthServerApiRequestPasswordResetCallbackParamsFor,
  type requestPasswordResetCallbackPropsFor,
} from "./requestPasswordResetCallback.types";
