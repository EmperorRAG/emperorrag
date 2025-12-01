/**
 * @file sendVerificationEmail.ts
 * @description Barrel export for sendVerificationEmail module
 */

export type { SendVerificationEmailInput, SendVerificationEmailResult, sendVerificationEmailProps } from './sendVerificationEmail.types';

export { sendVerificationEmailInputSchema } from './sendVerificationEmail.schema';
export { sendVerificationEmailClient } from './sendVerificationEmail.service';

// Controller exports (when implemented)
// export { sendVerificationEmailController } from './sendVerificationEmail.controller';
