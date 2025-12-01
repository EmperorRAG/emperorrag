/**
 * @file signInEmail.ts
 * @description Barrel export for signInEmail module
 */

export type { SignInEmailInput, SignInEmailResult, signInEmailProps } from './signInEmail.types';

export { signInEmailInputSchema } from './signInEmail.schema';
export { signInEmailClient } from './signInEmail.service';

// Controller exports (when implemented)
// export { signInEmailController } from './signInEmail.controller';
