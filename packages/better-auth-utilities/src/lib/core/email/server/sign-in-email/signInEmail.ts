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
} from './signInEmail.types.js';

export { signInEmailServerBodySchema, signInEmailServerParamsSchema } from './signInEmail.schema.js';

export { signInEmailServer } from './signInEmail.service.js';

// Controller exports (when implemented)
// export { signInEmailServerController } from './signInEmail.controller.js';
