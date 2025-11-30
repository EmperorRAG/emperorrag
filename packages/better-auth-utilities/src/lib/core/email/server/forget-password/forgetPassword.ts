/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/forget-password/forgetPassword.ts
 * @description Barrel export for server-side forget password module.
 */

export type {
	AuthServerForgetPasswordFor,
	ForgetPasswordServerInput,
	ForgetPasswordServerHeaders,
	ForgetPasswordServerParams,
	ForgetPasswordServerResult,
	forgetPasswordServerProps,
} from './forgetPassword.types';

export { forgetPasswordServerBodySchema, forgetPasswordServerParamsSchema } from './forgetPassword.schema';

export { forgetPasswordServer } from './forgetPassword.service';

// Controller exports (when implemented)
// export { forgetPasswordServerController } from './forgetPassword.controller';
