/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/link-social-account/linkSocialAccount.ts
 * @description Barrel export for server-side link social account module.
 */

export { linkSocialAccountServerService } from './linkSocialAccount.service';
export { linkSocialAccountServerController } from './linkSocialAccount.controller';
export {
	isAuthServerApiLinkSocialAccountParamsFor,
	type AuthServerApiLinkSocialAccountPropsFor,
	type AuthServerApiLinkSocialAccountParamsFor,
	type AuthServerApiLinkSocialAccountResultFor,
	type linkSocialAccountPropsFor,
} from './linkSocialAccount.types';
