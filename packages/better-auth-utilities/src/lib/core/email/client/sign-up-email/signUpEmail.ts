/**
 * @file signUpEmail.ts
 * @description Barrel export for signUpEmail module
 */

export type { SignUpEmailInput, SignUpEmailResult, signUpEmailProps } from './signUpEmail.types';

export { signUpEmailInputSchema } from './signUpEmail.schema';
export { signUpEmailClient } from './signUpEmail.service';

// Controller exports (when implemented)
// export { signUpEmailController } from './signUpEmail.controller';
