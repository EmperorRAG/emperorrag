/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/send-verification-email/sendVerificationEmail.ts
 * @description Barrel export for server-side send verification email module.
 */

export { sendVerificationEmailServerController } from "./sendVerificationEmail.controller";
export { sendVerificationEmailServerService } from "./sendVerificationEmail.service";
export type {
  AuthServerApiSendVerificationEmailParamsFor,
  AuthServerApiSendVerificationEmailPropsFor,
  AuthServerApiSendVerificationEmailResultFor,
  sendVerificationEmailPropsFor,
} from "./sendVerificationEmail.types";
export { isAuthServerApiSendVerificationEmailParamsFor } from "./sendVerificationEmail.types";
