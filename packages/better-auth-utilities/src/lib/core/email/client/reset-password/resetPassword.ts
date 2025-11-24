/**
 * @file resetPassword.ts
 * @description Barrel export for resetPassword module
 */

export type { ResetPasswordInput, ResetPasswordResult, resetPasswordProps } from './resetPassword.types.js';

export { resetPasswordInputSchema } from './resetPassword.schema.js';
export { resetPasswordClient } from './resetPassword.service.js';

// Controller exports (when implemented)
// export { resetPasswordController } from './resetPassword.controller.js';
