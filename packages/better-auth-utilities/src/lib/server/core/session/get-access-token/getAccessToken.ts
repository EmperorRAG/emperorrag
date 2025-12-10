/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/get-access-token/getAccessToken.ts
 * @description Barrel export for server-side get access token module.
 */

export { getAccessTokenServerService } from './getAccessToken.service';
export { getAccessTokenServerController } from './getAccessToken.controller';
export {
	isAuthServerApiGetAccessTokenParamsFor,
	type AuthServerApiGetAccessTokenPropsFor,
	type AuthServerApiGetAccessTokenParamsFor,
	type AuthServerApiGetAccessTokenResultFor,
	type getAccessTokenPropsFor,
} from './getAccessToken.types';
