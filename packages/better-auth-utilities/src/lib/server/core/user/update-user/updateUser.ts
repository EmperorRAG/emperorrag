/**
 * @file libs/better-auth-utilities/src/lib/core/user/server/update-user/updateUser.ts
 * @description Barrel export for server-side update user module.
 */

export { updateUserServerService } from './updateUser.service';
export { updateUserServerController } from './updateUser.controller';
export {
	isAuthServerApiUpdateUserParamsFor,
	type AuthServerApiUpdateUserPropsFor,
	type AuthServerApiUpdateUserParamsFor,
	type AuthServerApiUpdateUserResultFor,
	type updateUserPropsFor,
} from './updateUser.types';
