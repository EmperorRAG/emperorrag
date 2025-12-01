/**
 * @file resetPassword.ts
 * @description Barrel export for resetPassword module
 */

export type { ResetPasswordInput, ResetPasswordResult, resetPasswordProps } from './resetPassword.types';

export { resetPasswordInputSchema } from './resetPassword.schema';
export { resetPasswordClient } from './resetPassword.service';

// Controller exports (when implemented)
// export { resetPasswordController } from './resetPassword.controller';
