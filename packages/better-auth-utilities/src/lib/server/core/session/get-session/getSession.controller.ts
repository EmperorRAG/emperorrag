/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/get-session/getSession.controller.ts
 * @description Controller for server-side get session operation with validation.
 */

import * as Effect from 'effect/Effect';
import { validateInputEffect } from 'packages/better-auth-utilities/src/lib/pipeline/zod-input-validator/zodInputValidator';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import { createAuthServerApiEndpointParamsSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import type { AuthServerFor } from '../../../server.types';
import { getSessionServerService } from './getSession.service';
import { isAuthServerApiGetSessionParamsFor, type AuthServerApiGetSessionParamsFor, type getSessionPropsFor } from './getSession.types';

export const getSessionServerController: getSessionPropsFor = (params: AuthServerApiGetSessionParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		const validatedParams = yield* validateInputEffect(
			createAuthServerApiEndpointParamsSchema(AuthServerApiEndpoints.getSession),
			params,
			isAuthServerApiGetSessionParamsFor,
			'getSession'
		);
		return yield* getSessionServerService(validatedParams);
	});
