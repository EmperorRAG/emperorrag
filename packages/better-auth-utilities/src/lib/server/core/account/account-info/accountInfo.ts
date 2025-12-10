/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/account-info/accountInfo.ts
 * @description Barrel export for server-side account info module.
 */

export { accountInfoServerService } from './accountInfo.service';
export { accountInfoServerController } from './accountInfo.controller';
export {
	isAuthServerApiAccountInfoParamsFor,
	type AuthServerApiAccountInfoPropsFor,
	type AuthServerApiAccountInfoParamsFor,
	type AuthServerApiAccountInfoResultFor,
	type accountInfoPropsFor,
} from './accountInfo.types';
