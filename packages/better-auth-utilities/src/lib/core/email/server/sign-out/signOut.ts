/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/sign-out/signOut.ts
 * @description Barrel export for server-side sign-out module.
 */

export type { AuthServerSignOutFor, SignOutServerHeaders, SignOutServerParams, SignOutServerResult, signOutServerProps } from './signOut.types';

export { signOutServerParamsSchema } from './signOut.schema';

export { signOutServer } from './signOut.service';

// Controller exports (when implemented)
// export { signOutServerController } from './signOut.controller';
