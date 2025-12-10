/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/revoke-session/revokeSession.controller.ts
 * @description Controller for server-side revoke session operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createAuthSchema, sessionTokenBodySchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiRevokeSessionParamsFor, type AuthServerApiRevokeSessionParamsFor, type revokeSessionPropsFor } from './revokeSession.types';
import { validateInputEffect } from '../../shared/core.error';
import { revokeSessionServerService } from './revokeSession.service';

export const revokeSessionServerController: revokeSessionPropsFor = (params: AuthServerApiRevokeSessionParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		const validatedParams = yield* validateInputEffect(
			createAuthSchema({ body: sessionTokenBodySchema, headers: 'optional' }),
			params,
			isAuthServerApiRevokeSessionParamsFor,
			'revokeSession'
		);
		return yield* revokeSessionServerService(validatedParams);
	});
