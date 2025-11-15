/**
 * @file requestPasswordReset.ts
 * @description Barrel export for requestPasswordReset module
 */

export type { RequestPasswordResetInput, RequestPasswordResetResult, requestPasswordResetProps } from './requestPasswordReset.types.js';

export { requestPasswordResetInputSchema } from './requestPasswordReset.schema.js';
export { requestPasswordReset } from './requestPasswordReset.service.js';

// Controller exports (when implemented)
// export { requestPasswordResetController } from './requestPasswordReset.controller.js';
