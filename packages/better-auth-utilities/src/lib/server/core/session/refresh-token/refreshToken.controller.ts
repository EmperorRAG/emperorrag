/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/refresh-token/refreshToken.controller.ts
 * @description Controller for server-side refresh token operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createAuthSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiRefreshTokenParamsFor, type AuthServerApiRefreshTokenParamsFor, type refreshTokenPropsFor } from './refreshToken.types';
import { validateInputEffect } from '../../shared/core.error';
import { refreshTokenServerService } from './refreshToken.service';

export const refreshTokenServerController: refreshTokenPropsFor = (params: AuthServerApiRefreshTokenParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		const validatedParams = yield* validateInputEffect(
			createAuthSchema({ headers: 'optional' }),
			params,
			isAuthServerApiRefreshTokenParamsFor,
			'refreshToken'
		);
		return yield* refreshTokenServerService(validatedParams);
	});
