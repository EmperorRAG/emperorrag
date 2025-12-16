/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/reset-password/resetPassword.ts
 * @description Barrel export for server-side reset password module.
 */

export { resetPasswordServerController } from "./resetPassword.controller";
export { resetPasswordServerService } from "./resetPassword.service";
export type {
  AuthServerApiResetPasswordParamsFor,
  AuthServerApiResetPasswordPropsFor,
  AuthServerApiResetPasswordResultFor,
  resetPasswordPropsFor,
} from "./resetPassword.types";
export { isAuthServerApiResetPasswordParamsFor } from "./resetPassword.types";
