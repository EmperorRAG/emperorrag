/**
 * @file signUpEmail.ts
 * @description Barrel export for signUpEmail module
 */

export type { SignUpEmailInput, SignUpEmailResult, signUpEmailProps } from './signUpEmail.types.js';

export { signUpEmailInputSchema } from './signUpEmail.schema.js';
export { signUpEmail } from './signUpEmail.service.js';

// Controller exports (when implemented)
// export { signUpEmailController } from './signUpEmail.controller.js';
