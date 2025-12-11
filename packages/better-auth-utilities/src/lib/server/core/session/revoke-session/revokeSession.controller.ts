/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-session/revokeSession.controller.ts
 * @description Controller for server-side revoke session operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createAuthSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiRevokeSessionParamsFor, type AuthServerApiRevokeSessionParamsFor, type revokeSessionPropsFor } from './revokeSession.types';
import { validateInputEffect } from '../../shared/core.error';
import { revokeSessionServerService } from './revokeSession.service';

export const revokeSessionServerController: revokeSessionPropsFor = (params: AuthServerApiRevokeSessionParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		const validatedParams = yield* validateInputEffect(
			createAuthSchema(AuthServerApiEndpoints.revokeSession),
			params,
			isAuthServerApiRevokeSessionParamsFor,
			'revokeSession'
		);
		return yield* revokeSessionServerService(validatedParams);
	});
