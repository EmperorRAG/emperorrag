/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/sign-out/signOut.ts
 * @description Barrel export for server-side sign-out module.
 */

export type { AuthServerSignOutFor, SignOutServerHeaders, SignOutServerParams, SignOutServerResult, signOutServerProps } from './signOut.types.js';

export { signOutServerParamsSchema } from './signOut.schema.js';

export { signOutServer } from './signOut.service.js';

// Controller exports (when implemented)
// export { signOutServerController } from './signOut.controller.js';
