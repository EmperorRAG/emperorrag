/**
 * @file sendVerificationEmail.ts
 * @description Barrel export for sendVerificationEmail module
 */

export type { SendVerificationEmailInput, SendVerificationEmailResult, sendVerificationEmailProps } from './sendVerificationEmail.types.js';

export { sendVerificationEmailInputSchema } from './sendVerificationEmail.schema.js';
export { sendVerificationEmail } from './sendVerificationEmail.service.js';

// Controller exports (when implemented)
// export { sendVerificationEmailController } from './sendVerificationEmail.controller.js';
