/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/sign-in-social/signInSocial.ts
 * @description Barrel export for server-side OAuth social sign-in module.
 * Re-exports all public APIs for the signInSocial operation.
 */

export { signInSocialServerController } from './signInSocial.controller';
export { signInSocialServerService } from './signInSocial.service';
export {
	isAuthServerApiSignInSocialParamsFor,
	type AuthServerApiSignInSocialParamsFor,
	type AuthServerApiSignInSocialPropsFor,
	type AuthServerApiSignInSocialResultFor,
	type signInSocialPropsFor,
} from './signInSocial.types';
