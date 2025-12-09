/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/reset-password/resetPassword.ts
 * @description Barrel export for server-side reset password module.
 */

export { resetPasswordServerService } from './resetPassword.service';
export { resetPasswordServerController } from './resetPassword.controller';
export { createResetPasswordServerParamsSchema } from './resetPassword.schema';
export type {
	AuthServerApiResetPasswordPropsFor,
	AuthServerApiResetPasswordParamsFor,
	AuthServerApiResetPasswordResultFor,
	resetPasswordPropsFor,
} from './resetPassword.types';
export { isAuthServerApiResetPasswordParamsFor } from './resetPassword.types';
