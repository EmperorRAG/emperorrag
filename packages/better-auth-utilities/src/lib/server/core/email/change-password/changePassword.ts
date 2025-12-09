/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/change-password/changePassword.ts
 * @description Barrel export for server-side change password module.
 */

export { changePasswordServerService } from './changePassword.service';
export { changePasswordServerController } from './changePassword.controller';
export { createChangePasswordServerParamsSchema } from './changePassword.schema';
export type {
	AuthServerApiChangePasswordPropsFor,
	AuthServerApiChangePasswordParamsFor,
	AuthServerApiChangePasswordResultFor,
	changePasswordPropsFor,
} from './changePassword.types';
export { isAuthServerApiChangePasswordParamsFor } from './changePassword.types';
