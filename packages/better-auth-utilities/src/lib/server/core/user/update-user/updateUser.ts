/**
 * @file libs/better-auth-utilities/src/lib/core/user/server/update-user/updateUser.ts
 * @description Barrel export for server-side update user module.
 */

export { updateUserServerController } from "./updateUser.controller";
export { updateUserServerService } from "./updateUser.service";
export {
  type AuthServerApiUpdateUserParamsFor,
  type AuthServerApiUpdateUserPropsFor,
  type AuthServerApiUpdateUserResultFor,
  isAuthServerApiUpdateUserParamsFor,
  type updateUserPropsFor,
} from "./updateUser.types";
