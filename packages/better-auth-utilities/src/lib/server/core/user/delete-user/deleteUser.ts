/**
 * @file libs/better-auth-utilities/src/lib/server/core/user/delete-user/deleteUser.ts
 * @description Barrel export for server-side delete user module.
 */

export { deleteUserServerController } from "./deleteUser.controller";
export { deleteUserServerService } from "./deleteUser.service";
export {
  type AuthServerApiDeleteUserParamsFor,
  type AuthServerApiDeleteUserPropsFor,
  type AuthServerApiDeleteUserResultFor,
  type deleteUserPropsFor,
  isAuthServerApiDeleteUserParamsFor,
} from "./deleteUser.types";
