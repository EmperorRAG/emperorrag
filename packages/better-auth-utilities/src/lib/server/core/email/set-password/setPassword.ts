/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/set-password/setPassword.ts
 * @description Barrel export for server-side set password module.
 */

export { setPasswordServerController } from "./setPassword.controller";
export { setPasswordServerService } from "./setPassword.service";
export {
  type AuthServerApiSetPasswordParamsFor,
  type AuthServerApiSetPasswordPropsFor,
  type AuthServerApiSetPasswordResultFor,
  isAuthServerApiSetPasswordParamsFor,
  type setPasswordPropsFor,
} from "./setPassword.types";
