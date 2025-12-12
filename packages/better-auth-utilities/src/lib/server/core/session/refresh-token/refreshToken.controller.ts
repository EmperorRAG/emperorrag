/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/refresh-token/refreshToken.controller.ts
 * @description Controller for server-side refresh token operation with validation.
 */

import * as Effect from 'effect/Effect';
import { PipelineContext } from '../../../../context/pipeline.context';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import { validateInputEffect } from '../../../../pipeline/zod-input-validator/zodInputValidator';
import { createAuthServerApiEndpointParamsSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import type { AuthServerFor } from '../../../server.types';
import { refreshTokenServerService } from './refreshToken.service';
import { isAuthServerApiRefreshTokenParamsFor, type AuthServerApiRefreshTokenParamsFor, type refreshTokenPropsFor } from './refreshToken.types';

export const refreshTokenServerController: refreshTokenPropsFor = (params: AuthServerApiRefreshTokenParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		const validatedParams = yield* validateInputEffect(createAuthServerApiEndpointParamsSchema(), params, isAuthServerApiRefreshTokenParamsFor);
		return yield* refreshTokenServerService(validatedParams);
	}).pipe(
		Effect.provideService(PipelineContext, {
			endpoint: AuthServerApiEndpoints.refreshToken,
		})
	);
