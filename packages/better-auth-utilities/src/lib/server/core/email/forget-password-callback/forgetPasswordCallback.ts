/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/forget-password-callback/forgetPasswordCallback.ts
 * @description Barrel export for server-side forget password callback module.
 */

export { forgetPasswordCallbackServerService } from './forgetPasswordCallback.service';
export { forgetPasswordCallbackServerController } from './forgetPasswordCallback.controller';
export { createForgetPasswordCallbackServerParamsSchema } from './forgetPasswordCallback.schema';
export {
	isAuthServerApiForgetPasswordCallbackParamsFor,
	type AuthServerApiForgetPasswordCallbackPropsFor,
	type AuthServerApiForgetPasswordCallbackParamsFor,
	type AuthServerApiForgetPasswordCallbackResultFor,
	type forgetPasswordCallbackPropsFor,
} from './forgetPasswordCallback.types';
