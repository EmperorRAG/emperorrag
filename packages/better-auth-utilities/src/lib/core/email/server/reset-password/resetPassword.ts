/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/reset-password/resetPassword.ts
 * @description Barrel export for server-side reset password module.
 */

export type {
	AuthServerResetPasswordFor,
	ResetPasswordServerInput,
	ResetPasswordServerHeaders,
	ResetPasswordServerParams,
	ResetPasswordServerResult,
	resetPasswordServerProps,
} from './resetPassword.types.js';

export { resetPasswordServerBodySchema, resetPasswordServerParamsSchema } from './resetPassword.schema.js';

export { resetPasswordServer } from './resetPassword.service.js';

// Controller exports (when implemented)
// export { resetPasswordServerController } from './resetPassword.controller.js';
