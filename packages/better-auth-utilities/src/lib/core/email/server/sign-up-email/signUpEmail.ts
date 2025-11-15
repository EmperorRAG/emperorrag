/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/sign-up-email/signUpEmail.ts
 * @description Barrel export for server-side sign-up email module.
 */

export type {
	SignUpEmailServerInput,
	SignUpEmailServerHeaders,
	SignUpEmailServerParams,
	SignUpEmailServerResult,
	signUpEmailServerProps,
} from './signUpEmail.types.js';

export { signUpEmailServerBodySchema, signUpEmailServerParamsSchema } from './signUpEmail.schema.js';

export { signUpEmailServer } from './signUpEmail.service.js';

// Controller exports (when implemented)
// export { signUpEmailServerController } from './signUpEmail.controller.js';
