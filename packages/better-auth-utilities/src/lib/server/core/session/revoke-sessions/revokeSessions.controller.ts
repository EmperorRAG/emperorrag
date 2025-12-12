/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-sessions/revokeSessions.controller.ts
 * @description Controller for server-side revoke all sessions operation with validation.
 */

import * as Effect from 'effect/Effect';
import { PipelineContext } from '../../../../context/pipeline.context';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import { validateInputEffect } from '../../../../pipeline/zod-input-validator/zodInputValidator';
import { createAuthServerApiEndpointParamsSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import type { AuthServerFor } from '../../../server.types';
import { revokeSessionsServerService } from './revokeSessions.service';
import { isAuthServerApiRevokeSessionsParamsFor, type AuthServerApiRevokeSessionsParamsFor, type revokeSessionsPropsFor } from './revokeSessions.types';

export const revokeSessionsServerController: revokeSessionsPropsFor = (params: AuthServerApiRevokeSessionsParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		const validatedParams = yield* validateInputEffect(createAuthServerApiEndpointParamsSchema(), params, isAuthServerApiRevokeSessionsParamsFor);
		return yield* revokeSessionsServerService(validatedParams);
	}).pipe(
		Effect.provideService(PipelineContext, {
			endpoint: AuthServerApiEndpoints.revokeSessions,
		})
	);
