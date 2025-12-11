/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/list-sessions/listSessions.controller.ts
 * @description Controller for server-side list sessions operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createAuthSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiListSessionsParamsFor, type AuthServerApiListSessionsParamsFor, type listSessionsPropsFor } from './listSessions.types';
import { validateInputEffect } from '../../shared/core.error';
import { listSessionsServerService } from './listSessions.service';

export const listSessionsServerController: listSessionsPropsFor = (params: AuthServerApiListSessionsParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		const validatedParams = yield* validateInputEffect(
			createAuthSchema(AuthServerApiEndpoints.listSessions),
			params,
			isAuthServerApiListSessionsParamsFor,
			'listSessions'
		);
		return yield* listSessionsServerService(validatedParams);
	});
