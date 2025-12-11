/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/get-access-token/getAccessToken.controller.ts
 * @description Controller for server-side get access token operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createAuthSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiGetAccessTokenParamsFor, type AuthServerApiGetAccessTokenParamsFor, type getAccessTokenPropsFor } from './getAccessToken.types';
import { validateInputEffect } from '../../shared/core.error';
import { getAccessTokenServerService } from './getAccessToken.service';

export const getAccessTokenServerController: getAccessTokenPropsFor = (params: AuthServerApiGetAccessTokenParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		const validatedParams = yield* validateInputEffect(
			createAuthSchema(AuthServerApiEndpoints.getAccessToken),
			params,
			isAuthServerApiGetAccessTokenParamsFor,
			'getAccessToken'
		);
		return yield* getAccessTokenServerService(validatedParams);
	});
