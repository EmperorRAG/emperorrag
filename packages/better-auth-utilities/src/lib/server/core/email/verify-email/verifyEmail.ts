/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/verify-email/verifyEmail.ts
 * @description Barrel export for server-side verify email module.
 */

export { verifyEmailServerService } from './verifyEmail.service';
export { verifyEmailServerController } from './verifyEmail.controller';
export { createVerifyEmailServerParamsSchema } from './verifyEmail.schema';
export {
	isAuthServerApiVerifyEmailParamsFor,
	type AuthServerApiVerifyEmailPropsFor,
	type AuthServerApiVerifyEmailParamsFor,
	type AuthServerApiVerifyEmailResultFor,
	type verifyEmailPropsFor,
} from './verifyEmail.types';
