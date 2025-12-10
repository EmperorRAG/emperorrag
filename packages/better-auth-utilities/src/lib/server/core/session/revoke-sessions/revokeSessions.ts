/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-sessions/revokeSessions.ts
 * @description Barrel export for server-side revoke all sessions module.
 */

export { revokeSessionsServerService } from './revokeSessions.service';
export { revokeSessionsServerController } from './revokeSessions.controller';
export {
	isAuthServerApiRevokeSessionsParamsFor,
	type AuthServerApiRevokeSessionsPropsFor,
	type AuthServerApiRevokeSessionsParamsFor,
	type AuthServerApiRevokeSessionsResultFor,
	type revokeSessionsPropsFor,
} from './revokeSessions.types';
