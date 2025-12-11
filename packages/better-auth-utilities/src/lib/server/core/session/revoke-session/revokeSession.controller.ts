/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-session/revokeSession.controller.ts
 * @description Controller for server-side revoke session operation with validation.
 */

import * as Effect from 'effect/Effect';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import { validateInputEffect } from '../../../../pipeline/zod-input-validator/zodInputValidator';
import { createAuthServerApiEndpointParamsSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import type { AuthServerFor } from '../../../server.types';
import { revokeSessionServerService } from './revokeSession.service';
import { isAuthServerApiRevokeSessionParamsFor, type AuthServerApiRevokeSessionParamsFor, type revokeSessionPropsFor } from './revokeSession.types';

export const revokeSessionServerController: revokeSessionPropsFor = (params: AuthServerApiRevokeSessionParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		const validatedParams = yield* validateInputEffect(
			createAuthServerApiEndpointParamsSchema(AuthServerApiEndpoints.revokeSession),
			params,
			isAuthServerApiRevokeSessionParamsFor,
			'revokeSession'
		);
		return yield* revokeSessionServerService(validatedParams);
	});
