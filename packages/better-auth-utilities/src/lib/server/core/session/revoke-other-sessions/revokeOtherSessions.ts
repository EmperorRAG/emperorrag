/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-other-sessions/revokeOtherSessions.ts
 * @description Barrel export for server-side revoke other sessions module.
 */

export { revokeOtherSessionsServerService } from './revokeOtherSessions.service';
export { revokeOtherSessionsServerController } from './revokeOtherSessions.controller';
export {
	isAuthServerApiRevokeOtherSessionsParamsFor,
	type AuthServerApiRevokeOtherSessionsPropsFor,
	type AuthServerApiRevokeOtherSessionsParamsFor,
	type AuthServerApiRevokeOtherSessionsResultFor,
	type revokeOtherSessionsPropsFor,
} from './revokeOtherSessions.types';
