/**
 * @file signUpEmail.ts
 * @description Barrel export for signUpEmail module
 */

export type { SignUpEmailInput, SignUpEmailResult, signUpEmailProps, EmailAuthClientDeps } from './signUpEmail.types.js';

export { signUpEmailInputSchema, emailAuthClientDepsSchema } from './signUpEmail.schema.js';
export { signUpEmail } from './signUpEmail.service.js';

// Controller exports (when implemented)
// export { signUpEmailController } from './signUpEmail.controller.js';
