/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/link-social-account/linkSocialAccount.controller.ts
 * @description Controller for server-side link social account operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createLinkSocialAccountServerParamsSchema } from './linkSocialAccount.schema';
import type { AuthServerFor } from '../../../server.types';
import {
	isAuthServerApiLinkSocialAccountParamsFor,
	type AuthServerApiLinkSocialAccountParamsFor,
	type linkSocialAccountPropsFor,
} from './linkSocialAccount.types';
import { validateInputEffect } from '../shared/oauth.error';
import { linkSocialAccountServerService } from './linkSocialAccount.service';
import { OAuthAuthServerServiceTag } from '../shared/oauth.service';

/**
 * Controller for link social account operation with input validation.
 *
 * @pure
 * @description Validates input parameters using dynamically generated Zod schema,
 * then delegates to the service layer. Uses validateInputEffect for composable
 * error tracing through schema creation, parsing, and type guard validation.
 *
 * @remarks
 * **Validation Flow:**
 * 1. Retrieve authServer from Effect context
 * 2. Create schema via Effect pipeline
 * 3. Parse and validate with type guard
 * 4. Call service with validated params
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - The link social account parameters to validate and process
 * @returns Effect requiring OAuthAuthServerService context
 */
export const linkSocialAccountServerController: linkSocialAccountPropsFor = <T extends AuthServerFor = AuthServerFor>(
	params: AuthServerApiLinkSocialAccountParamsFor<T>
) =>
	Effect.gen(function* () {
		const { authServer } = yield* OAuthAuthServerServiceTag;
		const validatedParams = yield* validateInputEffect(
			createLinkSocialAccountServerParamsSchema(authServer),
			params,
			isAuthServerApiLinkSocialAccountParamsFor<T>,
			'linkSocialAccount'
		);
		return yield* linkSocialAccountServerService(validatedParams);
	});
