/**
 * @file libs/better-auth-utilities/src/lib/core/user/server/update-user/updateUser.service.ts
 * @description Server-side service for update user operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import { mapApiError } from '../../../../pipeline/map-api-error/mapApiError';
import { AuthServerTag } from '../../../server.service';
import type { AuthServerFor } from '../../../server.types';
import type { AuthServerApiUpdateUserParamsFor, updateUserPropsFor } from './updateUser.types';

/**
 * Update user profile via Better Auth server API.
 *
 * @pure
 * @description Wraps auth.api.updateUser in an Effect, converting Promise-based
 * errors into typed AuthServerApiError failures. Updates user profile information
 * like name, email, and image.
 *
 * @remarks
 * **Context-Based Dependency Injection:**
 * - Dependencies accessed via Effect.flatMap(AuthServerTag, ...)
 * - Function accepts only the API parameters directly
 * - Effect executes lazily when run with provided context
 *
 * **Update Process:**
 * - Validates user identity via session/headers
 * - Updates specified fields in user record
 * - Returns updated user data
 *
 * **Error Handling:**
 * - Better Auth throws APIError instances on failure
 * - Common errors: Unauthorized (401), validation failures (400)
 * - Status codes extracted and preserved in AuthServerApiError
 * - Error cause chain maintained for debugging
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - The update user parameters containing body and optional headers
 * @returns Effect that resolves to updated user data or fails with AuthServerApiError
 */
export const updateUserServerService: updateUserPropsFor = (params: AuthServerApiUpdateUserParamsFor<AuthServerFor>) =>
	Effect.flatMap(AuthServerTag, (authServer) =>
		Effect.tryPromise({
			try: () => authServer.api.updateUser(params),
			catch: mapApiError,
		})
	);
