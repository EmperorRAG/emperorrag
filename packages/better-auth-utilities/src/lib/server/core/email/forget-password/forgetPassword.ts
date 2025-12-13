/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/forget-password/forgetPassword.ts
 * @description Barrel export for server-side forget password module.
 */

export { forgetPasswordServerService } from './forgetPassword.service';
export { forgetPasswordServerController } from './forgetPassword.controller';
export type {
	AuthServerApiForgetPasswordPropsFor,
	AuthServerApiForgetPasswordParamsFor,
	AuthServerApiForgetPasswordResultFor,
	forgetPasswordPropsFor,
} from './forgetPassword.types';
export { isAuthServerApiForgetPasswordParamsFor } from './forgetPassword.types';
