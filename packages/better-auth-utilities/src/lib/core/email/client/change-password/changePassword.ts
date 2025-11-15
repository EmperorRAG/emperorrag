/**
 * @file changePassword.ts
 * @description Barrel export for changePassword module
 */

export type { ChangePasswordInput, ChangePasswordResult, changePasswordProps } from './changePassword.types.js';

export { changePasswordInputSchema } from './changePassword.schema.js';
export { changePassword } from './changePassword.service.js';

// Controller exports (when implemented)
// export { changePasswordController } from './changePassword.controller.js';
