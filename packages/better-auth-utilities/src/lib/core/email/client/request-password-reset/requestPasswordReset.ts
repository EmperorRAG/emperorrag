/**
 * @file requestPasswordReset.ts
 * @description Barrel export for requestPasswordReset module
 */

export type { RequestPasswordResetInput, RequestPasswordResetResult, requestPasswordResetProps } from './requestPasswordReset.types';

export { requestPasswordResetInputSchema } from './requestPasswordReset.schema';
export { requestPasswordResetClient } from './requestPasswordReset.service';

// Controller exports (when implemented)
// export { requestPasswordResetController } from './requestPasswordReset.controller';
