/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/request-password-reset-callback/requestPasswordResetCallback.ts
 * @description Barrel export for server-side request password reset callback module.
 */

export { requestPasswordResetCallbackServerService } from './requestPasswordResetCallback.service';
export { requestPasswordResetCallbackServerController } from './requestPasswordResetCallback.controller';
export { createRequestPasswordResetCallbackServerParamsSchema } from './requestPasswordResetCallback.schema';
export {
	isAuthServerApiRequestPasswordResetCallbackParamsFor,
	type AuthServerApiRequestPasswordResetCallbackPropsFor,
	type AuthServerApiRequestPasswordResetCallbackParamsFor,
	type AuthServerApiRequestPasswordResetCallbackResultFor,
	type requestPasswordResetCallbackPropsFor,
} from './requestPasswordResetCallback.types';
