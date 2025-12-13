/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-session/revokeSession.ts
 * @description Barrel export for server-side revoke session module.
 */

export { revokeSessionServerService } from './revokeSession.service';
export { revokeSessionServerController } from './revokeSession.controller';
export {
	isAuthServerApiRevokeSessionParamsFor,
	type AuthServerApiRevokeSessionPropsFor,
	type AuthServerApiRevokeSessionParamsFor,
	type AuthServerApiRevokeSessionResultFor,
	type revokeSessionPropsFor,
} from './revokeSession.types';
