/**
 * @file signOut.ts
 * @description Barrel export for signOut module
 */

export type { SignOutInput, SignOutResult, signOutProps } from './signOut.types.js';

export { signOutInputSchema } from './signOut.schema.js';
export { signOutClient } from './signOut.service.js';

// Controller exports (when implemented)
// export { signOutController } from './signOut.controller.js';
