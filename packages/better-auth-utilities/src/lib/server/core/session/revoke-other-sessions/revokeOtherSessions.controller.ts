/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-other-sessions/revokeOtherSessions.controller.ts
 * @description Controller for server-side revoke other sessions operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createAuthSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import type { AuthServerFor } from '../../../server.types';
import {
	isAuthServerApiRevokeOtherSessionsParamsFor,
	type AuthServerApiRevokeOtherSessionsParamsFor,
	type revokeOtherSessionsPropsFor,
} from './revokeOtherSessions.types';
import { validateInputEffect } from '../../shared/core.error';
import { revokeOtherSessionsServerService } from './revokeOtherSessions.service';

export const revokeOtherSessionsServerController: revokeOtherSessionsPropsFor = (params: AuthServerApiRevokeOtherSessionsParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		const validatedParams = yield* validateInputEffect(
			createAuthSchema({ headers: 'optional' }),
			params,
			isAuthServerApiRevokeOtherSessionsParamsFor,
			'revokeOtherSessions'
		);
		return yield* revokeOtherSessionsServerService(validatedParams);
	});
