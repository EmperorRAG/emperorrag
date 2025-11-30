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
} from './signUpEmail.types';

export { signUpEmailServerBodySchema, signUpEmailServerParamsSchema } from './signUpEmail.schema';

export { signUpEmailServer } from './signUpEmail.service';

// Controller exports (when implemented)
// export { signUpEmailServerController } from './signUpEmail.controller';
