/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-other-sessions/revokeOtherSessions.controller.ts
 * @description Controller for server-side revoke other sessions operation with validation.
 */

import * as Effect from 'effect/Effect';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import { validateInputEffect } from '../../../../pipeline/zod-input-validator/zodInputValidator';
import { createAuthServerApiEndpointParamsSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import type { AuthServerFor } from '../../../server.types';
import { revokeOtherSessionsServerService } from './revokeOtherSessions.service';
import {
	isAuthServerApiRevokeOtherSessionsParamsFor,
	type AuthServerApiRevokeOtherSessionsParamsFor,
	type revokeOtherSessionsPropsFor,
} from './revokeOtherSessions.types';

export const revokeOtherSessionsServerController: revokeOtherSessionsPropsFor = (params: AuthServerApiRevokeOtherSessionsParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		const validatedParams = yield* validateInputEffect(
			createAuthServerApiEndpointParamsSchema(AuthServerApiEndpoints.revokeOtherSessions),
			params,
			isAuthServerApiRevokeOtherSessionsParamsFor,
			AuthServerApiEndpoints.revokeOtherSessions
		);
		return yield* revokeOtherSessionsServerService(validatedParams);
	});
