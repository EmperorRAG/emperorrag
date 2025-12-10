/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/unlink-account/unlinkAccount.ts
 * @description Barrel export for server-side unlink account module.
 */

export { unlinkAccountServerService } from './unlinkAccount.service';
export { unlinkAccountServerController } from './unlinkAccount.controller';
export type {
	AuthServerApiUnlinkAccountPropsFor,
	AuthServerApiUnlinkAccountParamsFor,
	AuthServerApiUnlinkAccountResultFor,
	unlinkAccountPropsFor,
} from './unlinkAccount.types';
export { isAuthServerApiUnlinkAccountParamsFor } from './unlinkAccount.types';
