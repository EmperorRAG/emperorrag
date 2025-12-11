/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/get-session/getSession.controller.ts
 * @description Controller for server-side get session operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createAuthSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiGetSessionParamsFor, type AuthServerApiGetSessionParamsFor, type getSessionPropsFor } from './getSession.types';
import { validateInputEffect } from '../../shared/core.error';
import { getSessionServerService } from './getSession.service';

export const getSessionServerController: getSessionPropsFor = (params: AuthServerApiGetSessionParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		const validatedParams = yield* validateInputEffect(
			createAuthSchema(AuthServerApiEndpoints.getSession),
			params,
			isAuthServerApiGetSessionParamsFor,
			'getSession'
		);
		return yield* getSessionServerService(validatedParams);
	});
