/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-sessions/revokeSessions.controller.ts
 * @description Controller for server-side revoke all sessions operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createAuthSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiRevokeSessionsParamsFor, type AuthServerApiRevokeSessionsParamsFor, type revokeSessionsPropsFor } from './revokeSessions.types';
import { validateInputEffect } from '../../shared/core.error';
import { revokeSessionsServerService } from './revokeSessions.service';

export const revokeSessionsServerController: revokeSessionsPropsFor = (params: AuthServerApiRevokeSessionsParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		const validatedParams = yield* validateInputEffect(
			createAuthSchema({ headers: 'optional' }),
			params,
			isAuthServerApiRevokeSessionsParamsFor,
			'revokeSessions'
		);
		return yield* revokeSessionsServerService(validatedParams);
	});
