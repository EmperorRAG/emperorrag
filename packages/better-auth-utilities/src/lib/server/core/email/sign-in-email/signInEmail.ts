/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/sign-in-email/signInEmail.ts
 * @description Barrel export for server-side sign-in email module.
 */

export { signInEmailServerService } from './signInEmail.service';
export { signInEmailServerController } from './signInEmail.controller';
export type {
	AuthServerApiSignInEmailPropsFor,
	AuthServerApiSignInEmailParamsFor,
	AuthServerApiSignInEmailResultFor,
	signInEmailPropsFor,
} from './signInEmail.types';
export { isAuthServerApiSignInEmailParamsFor } from './signInEmail.types';
