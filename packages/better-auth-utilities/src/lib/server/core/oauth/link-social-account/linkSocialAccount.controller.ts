/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/link-social-account/linkSocialAccount.controller.ts
 * @description Server-side controller for link social account operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createLinkSocialAccountServerParamsSchema } from './linkSocialAccount.schema';
import type { AuthServerFor } from '../../../server.types';
import {
	isAuthServerApiLinkSocialAccountParamsFor,
	type AuthServerApiLinkSocialAccountParamsFor,
	type linkSocialAccountPropsFor,
} from './linkSocialAccount.types';
import { OAuthServerInputError } from '../shared/oauth.error';
import { linkSocialAccountServerService } from './linkSocialAccount.service';
import { OAuthServerServiceTag } from '../shared/oauth.service';

export const linkSocialAccountServerController: linkSocialAccountPropsFor = <T extends AuthServerFor = AuthServerFor>(
	params: AuthServerApiLinkSocialAccountParamsFor<T>
) =>
	Effect.gen(function* (_) {
		const { authServer } = yield* _(OAuthServerServiceTag);
		const schema = yield* _(createLinkSocialAccountServerParamsSchema(authServer));

		const parsed = schema.safeParse(params);

		if (!parsed.success) {
			const message = 'Invalid link social account parameters';
			const cause = parsed.error;
			return yield* _(Effect.fail(new OAuthServerInputError(message, cause)));
		}

		if (!isAuthServerApiLinkSocialAccountParamsFor<T>(parsed.data)) {
			const message = 'Parsed data does not conform to expected link social account parameters structure';
			return yield* _(Effect.fail(new OAuthServerInputError(message)));
		}

		const result = yield* _(linkSocialAccountServerService(parsed.data));

		return result;
	});
