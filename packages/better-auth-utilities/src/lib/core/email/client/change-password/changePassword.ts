/**
 * @file changePassword.ts
 * @description Barrel export for changePassword module
 */

export type { ChangePasswordInput, ChangePasswordResult, changePasswordProps } from './changePassword.types';

export { changePasswordInputSchema } from './changePassword.schema';
export { changePasswordClient } from './changePassword.service';

// Controller exports (when implemented)
// export { changePasswordController } from './changePassword.controller';
