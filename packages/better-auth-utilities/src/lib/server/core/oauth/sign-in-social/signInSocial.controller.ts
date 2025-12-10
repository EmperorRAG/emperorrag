/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/sign-in-social/signInSocial.controller.ts
 * @description Controller for server-side OAuth social sign-in operation with validation.
 */

import * as Effect from 'effect/Effect';
import { createSignInSocialServerParamsSchema } from './signInSocial.schema';
import type { AuthServerFor } from '../../../server.types';
import { isAuthServerApiSignInSocialParamsFor, type AuthServerApiSignInSocialParamsFor, type signInSocialPropsFor } from './signInSocial.types';
import { validateInputEffect } from '../../shared/core.error';
import { signInSocialServerService } from './signInSocial.service';
import { OAuthAuthServerServiceTag } from '../shared/oauth.service';

/**
 * Controller for server-side OAuth social sign-in operation with validation.
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
 * @param params - The OAuth sign-in parameters to validate and process
 * @returns Effect requiring OAuthAuthServerService context
 */
export const signInSocialServerController: signInSocialPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiSignInSocialParamsFor<T>) =>
	Effect.gen(function* () {
		const { authServer } = yield* OAuthAuthServerServiceTag;
		const validatedParams = yield* validateInputEffect(
			createSignInSocialServerParamsSchema(authServer),
			params,
			isAuthServerApiSignInSocialParamsFor<T>,
			'signInSocial'
		);
		return yield* signInSocialServerService(validatedParams);
	});
