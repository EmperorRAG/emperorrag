/**
 * @file signInEmail.ts
 * @description Barrel export for signInEmail module
 */

export type { SignInEmailInput, SignInEmailResult, signInEmailProps } from './signInEmail.types.js';

export { signInEmailInputSchema } from './signInEmail.schema.js';
export { signInEmailClient } from './signInEmail.service.js';

// Controller exports (when implemented)
// export { signInEmailController } from './signInEmail.controller.js';
