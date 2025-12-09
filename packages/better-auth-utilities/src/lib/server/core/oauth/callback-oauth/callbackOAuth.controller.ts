/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/callback-oauth/callbackOAuth.controller.ts
 * @description Server-side controller for OAuth callback operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createCallbackOAuthServerParamsSchema } from './callbackOAuth.schema';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiCallbackOAuthParamsFor, type AuthServerApiCallbackOAuthParamsFor, type callbackOAuthPropsFor } from './callbackOAuth.types';
import { OAuthServerInputError } from '../shared/oauth.error';
import { callbackOAuthServerService } from './callbackOAuth.service';
import { OAuthServerServiceTag } from '../shared/oauth.service';

export const callbackOAuthServerController: callbackOAuthPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiCallbackOAuthParamsFor<T>) =>
	Effect.gen(function* (_) {
		const { authServer } = yield* _(OAuthServerServiceTag);
		const schema = yield* _(createCallbackOAuthServerParamsSchema(authServer));

		const parsed = schema.safeParse(params);

		if (!parsed.success) {
			const message = 'Invalid OAuth callback parameters';
			const cause = parsed.error;
			return yield* _(Effect.fail(new OAuthServerInputError(message, cause)));
		}

		if (!isAuthServerApiCallbackOAuthParamsFor<T>(parsed.data)) {
			const message = 'Parsed data does not conform to expected OAuth callback parameters structure';
			return yield* _(Effect.fail(new OAuthServerInputError(message)));
		}

		const result = yield* _(callbackOAuthServerService(parsed.data));

		return result;
	});
