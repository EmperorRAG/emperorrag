/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/list-sessions/listSessions.controller.ts
 * @description Controller for server-side list sessions operation with validation.
 */

import * as Effect from 'effect/Effect';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import { validateInputEffect } from '../../../../pipeline/zod-input-validator/zodInputValidator';
import { createAuthServerApiEndpointParamsSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import type { AuthServerFor } from '../../../server.types';
import { listSessionsServerService } from './listSessions.service';
import { isAuthServerApiListSessionsParamsFor, type AuthServerApiListSessionsParamsFor, type listSessionsPropsFor } from './listSessions.types';

export const listSessionsServerController: listSessionsPropsFor = (params: AuthServerApiListSessionsParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		const validatedParams = yield* validateInputEffect(
			createAuthServerApiEndpointParamsSchema(AuthServerApiEndpoints.listSessions),
			params,
			isAuthServerApiListSessionsParamsFor,
			'listSessions'
		);
		return yield* listSessionsServerService(validatedParams);
	});
