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
} from './sendVerificationEmail.types';

export { sendVerificationEmailServerBodySchema, sendVerificationEmailServerParamsSchema } from './sendVerificationEmail.schema';

export { sendVerificationEmailServer } from './sendVerificationEmail.service';

// Controller exports (when implemented)
// export { sendVerificationEmailServerController } from './sendVerificationEmail.controller';
