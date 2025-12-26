/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/change-password/changePassword.ts
 * @description Barrel export for server-side change password module.
 */

export { changePasswordServerController } from "./changePassword.controller";
export { changePasswordServerService } from "./changePassword.service";
export type {
  AuthServerApiChangePasswordParamsFor,
  AuthServerApiChangePasswordPropsFor,
  AuthServerApiChangePasswordResultFor,
  changePasswordPropsFor,
} from "./changePassword.types";
export { isAuthServerApiChangePasswordParamsFor } from "./changePassword.types";
