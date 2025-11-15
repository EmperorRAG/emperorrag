/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/send-verification-email/sendVerificationEmail.ts
 * @description Barrel export for server-side send verification email module.
 */

export type {
	AuthServerSendVerificationEmailFor,
	SendVerificationEmailServerInput,
	SendVerificationEmailServerHeaders,
	SendVerificationEmailServerParams,
	SendVerificationEmailServerResult,
	sendVerificationEmailServerProps,
} from './sendVerificationEmail.types.js';

export { sendVerificationEmailServerBodySchema, sendVerificationEmailServerParamsSchema } from './sendVerificationEmail.schema.js';

export { sendVerificationEmailServer } from './sendVerificationEmail.service.js';

// Controller exports (when implemented)
// export { sendVerificationEmailServerController } from './sendVerificationEmail.controller.js';
