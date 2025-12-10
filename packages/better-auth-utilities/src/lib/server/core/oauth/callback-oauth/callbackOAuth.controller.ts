/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/callback-oauth/callbackOAuth.controller.ts
 * @description Server-side controller for OAuth callback operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createCallbackOAuthServerParamsSchema } from './callbackOAuth.schema';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiCallbackOAuthParamsFor, type AuthServerApiCallbackOAuthParamsFor, type callbackOAuthPropsFor } from './callbackOAuth.types';
import { validateInputEffect } from '../shared/oauth.error';
import { callbackOAuthServerService } from './callbackOAuth.service';
import { OAuthAuthServerServiceTag } from '../shared/oauth.service';

export const callbackOAuthServerController: callbackOAuthPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiCallbackOAuthParamsFor<T>) =>
	Effect.gen(function* () {
		const { authServer } = yield* OAuthAuthServerServiceTag;
		const validatedParams = yield* validateInputEffect(
			createCallbackOAuthServerParamsSchema(authServer),
			params,
			isAuthServerApiCallbackOAuthParamsFor<T>,
			'callbackOAuth'
		);
		return yield* callbackOAuthServerService(validatedParams);
	});
