/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/change-email/changeEmail.ts
 * @description Barrel export for server-side change email module.
 */

export { changeEmailServerController } from "./changeEmail.controller";
export { changeEmailServerService } from "./changeEmail.service";
export {
  type AuthServerApiChangeEmailParamsFor,
  type AuthServerApiChangeEmailPropsFor,
  type AuthServerApiChangeEmailResultFor,
  type changeEmailPropsFor,
  isAuthServerApiChangeEmailParamsFor,
} from "./changeEmail.types";
