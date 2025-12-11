/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/link-social-account/linkSocialAccount.controller.ts
 * @description Controller for server-side link social account operation with validation.
 */

import * as Effect from 'effect/Effect';
import { AuthServerApiEndpoints } from '../../../../enums/authServerApiEndpoints.enum';
import { validateInputEffect } from '../../../../pipeline/zod-input-validator/zodInputValidator';
import { createAuthServerApiEndpointParamsSchema } from '../../../../pipeline/zod-schema-builder/zodSchemaBuilder';
import type { AuthServerFor } from '../../../server.types';
import { linkSocialAccountServerService } from './linkSocialAccount.service';
import {
	isAuthServerApiLinkSocialAccountParamsFor,
	type AuthServerApiLinkSocialAccountParamsFor,
	type linkSocialAccountPropsFor,
} from './linkSocialAccount.types';

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
 * @returns Effect requiring AuthServerFor context
 */
export const linkSocialAccountServerController: linkSocialAccountPropsFor = (params: AuthServerApiLinkSocialAccountParamsFor<AuthServerFor>) =>
	Effect.gen(function* () {
		const validatedParams = yield* validateInputEffect(
			createAuthServerApiEndpointParamsSchema(AuthServerApiEndpoints.linkSocialAccount),
			params,
			isAuthServerApiLinkSocialAccountParamsFor,
			AuthServerApiEndpoints.linkSocialAccount
		);
		return yield* linkSocialAccountServerService(validatedParams);
	});
