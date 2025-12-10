/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/callback-oauth/callbackOAuth.controller.ts
 * @description Server-side controller for OAuth callback operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createBaseSchema, withQuery, oauthQueryParamsOptionalSchema, withOptionalHeaders } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import { pipe } from 'effect/Function';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiCallbackOAuthParamsFor, type AuthServerApiCallbackOAuthParamsFor, type callbackOAuthPropsFor } from './callbackOAuth.types';
import { validateInputEffect } from '../../shared/core.error';
import { callbackOAuthServerService } from './callbackOAuth.service';

export const callbackOAuthServerController: callbackOAuthPropsFor = (params: AuthServerApiCallbackOAuthParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		const validatedParams = yield* validateInputEffect(
			Effect.succeed(pipe(createBaseSchema(), withQuery(oauthQueryParamsOptionalSchema), withOptionalHeaders())),
			params,
			isAuthServerApiCallbackOAuthParamsFor,
			'callbackOAuth'
		);
		return yield* callbackOAuthServerService(validatedParams);
	});
