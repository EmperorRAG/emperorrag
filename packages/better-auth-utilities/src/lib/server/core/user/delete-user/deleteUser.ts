/**
 * @file libs/better-auth-utilities/src/lib/server/core/user/delete-user/deleteUser.ts
 * @description Barrel export for server-side delete user module.
 */

export { deleteUserServerService } from './deleteUser.service';
export { deleteUserServerController } from './deleteUser.controller';
export { createDeleteUserServerParamsSchema } from './deleteUser.schema';
export {
	isAuthServerApiDeleteUserParamsFor,
	type AuthServerApiDeleteUserPropsFor,
	type AuthServerApiDeleteUserParamsFor,
	type AuthServerApiDeleteUserResultFor,
	type deleteUserPropsFor,
} from './deleteUser.types';
