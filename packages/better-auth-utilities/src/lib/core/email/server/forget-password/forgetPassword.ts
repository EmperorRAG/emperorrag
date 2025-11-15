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
} from './forgetPassword.types.js';

export { forgetPasswordServerBodySchema, forgetPasswordServerParamsSchema } from './forgetPassword.schema.js';

export { forgetPasswordServer } from './forgetPassword.service.js';

// Controller exports (when implemented)
// export { forgetPasswordServerController } from './forgetPassword.controller.js';
