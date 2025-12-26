/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/sign-out/signOut.ts
 * @description Barrel export for server-side sign-out module.
 */

export { signOutServerController } from "./signOut.controller";
export { signOutServerService } from "./signOut.service";
export type {
  AuthServerApiSignOutParamsFor,
  AuthServerApiSignOutPropsFor,
  AuthServerApiSignOutResultFor,
  signOutPropsFor,
} from "./signOut.types";
export { isAuthServerApiSignOutParamsFor } from "./signOut.types";
