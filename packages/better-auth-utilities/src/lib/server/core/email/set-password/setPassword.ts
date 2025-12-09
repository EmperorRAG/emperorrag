/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/set-password/setPassword.ts
 * @description Barrel export for server-side set password module.
 */

export { setPasswordServerService } from './setPassword.service';
export { setPasswordServerController } from './setPassword.controller';
export { createSetPasswordServerParamsSchema } from './setPassword.schema';
export {
	isAuthServerApiSetPasswordParamsFor,
	type AuthServerApiSetPasswordPropsFor,
	type AuthServerApiSetPasswordParamsFor,
	type AuthServerApiSetPasswordResultFor,
	type setPasswordPropsFor,
} from './setPassword.types';
