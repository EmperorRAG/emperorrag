/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/verify-email/verifyEmail.ts
 * @description Barrel export for server-side verify email module.
 */

export { verifyEmailServerController } from "./verifyEmail.controller";
export { verifyEmailServerService } from "./verifyEmail.service";
export {
  type AuthServerApiVerifyEmailParamsFor,
  type AuthServerApiVerifyEmailPropsFor,
  type AuthServerApiVerifyEmailResultFor,
  isAuthServerApiVerifyEmailParamsFor,
  type verifyEmailPropsFor,
} from "./verifyEmail.types";
