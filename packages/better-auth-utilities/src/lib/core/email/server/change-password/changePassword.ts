/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/change-password/changePassword.ts
 * @description Barrel export for server-side change password module.
 */

export type {
	AuthServerChangePasswordFor,
	ChangePasswordServerInput,
	ChangePasswordServerHeaders,
	ChangePasswordServerParams,
	ChangePasswordServerResult,
	changePasswordServerProps,
} from './changePassword.types';

export { changePasswordServerBodySchema, changePasswordServerParamsSchema } from './changePassword.schema';

export { changePasswordServer } from './changePassword.service';

// Controller exports (when implemented)
// export { changePasswordServerController } from './changePassword.controller';
