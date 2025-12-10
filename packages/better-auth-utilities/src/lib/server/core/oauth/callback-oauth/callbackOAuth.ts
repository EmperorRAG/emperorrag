/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/callback-oauth/callbackOAuth.ts
 * @description Barrel export for server-side OAuth callback module.
 */

export { callbackOAuthServerService } from './callbackOAuth.service';
export { callbackOAuthServerController } from './callbackOAuth.controller';
export {
	isAuthServerApiCallbackOAuthParamsFor,
	type AuthServerApiCallbackOAuthPropsFor,
	type AuthServerApiCallbackOAuthParamsFor,
	type AuthServerApiCallbackOAuthResultFor,
	type callbackOAuthPropsFor,
} from './callbackOAuth.types';
