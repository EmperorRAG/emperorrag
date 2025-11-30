/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/sign-in-email/signInEmail.ts
 * @description Barrel export for server-side sign-in email module.
 */

export type {
	SignInEmailServerInput,
	SignInEmailServerHeaders,
	SignInEmailServerParams,
	SignInEmailServerResult,
	signInEmailServerProps,
} from './signInEmail.types';

export { signInEmailServerBodySchema, signInEmailServerParamsSchema } from './signInEmail.schema';

export { signInEmailServer } from './signInEmail.service';

// Controller exports (when implemented)
// export { signInEmailServerController } from './signInEmail.controller';
