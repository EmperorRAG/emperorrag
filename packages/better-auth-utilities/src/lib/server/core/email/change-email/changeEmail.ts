/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/change-email/changeEmail.ts
 * @description Barrel export for server-side change email module.
 */

export { changeEmailServerService } from './changeEmail.service';
export { changeEmailServerController } from './changeEmail.controller';
export { createChangeEmailServerParamsSchema } from './changeEmail.schema';
export {
	isAuthServerApiChangeEmailParamsFor,
	type AuthServerApiChangeEmailPropsFor,
	type AuthServerApiChangeEmailParamsFor,
	type AuthServerApiChangeEmailResultFor,
	type changeEmailPropsFor,
} from './changeEmail.types';
