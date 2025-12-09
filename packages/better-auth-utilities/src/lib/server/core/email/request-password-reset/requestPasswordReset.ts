/**
 * @file libs/better-auth-utilities/src/lib/server/core/email/request-password-reset/requestPasswordReset.ts
 * @description Barrel export for server-side request password reset module.
 */

export { requestPasswordResetServerService } from './requestPasswordReset.service';
export { requestPasswordResetServerController } from './requestPasswordReset.controller';
export { createRequestPasswordResetServerParamsSchema } from './requestPasswordReset.schema';
export {
	isAuthServerApiRequestPasswordResetParamsFor,
	type AuthServerApiRequestPasswordResetPropsFor,
	type AuthServerApiRequestPasswordResetParamsFor,
	type AuthServerApiRequestPasswordResetResultFor,
	type requestPasswordResetPropsFor,
} from './requestPasswordReset.types';
