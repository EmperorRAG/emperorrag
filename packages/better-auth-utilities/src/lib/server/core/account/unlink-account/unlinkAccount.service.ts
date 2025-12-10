/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/unlink-account/unlinkAccount.service.ts
 * @description Server-side service for unlink account operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import type { AuthServerApiUnlinkAccountParamsFor, unlinkAccountPropsFor } from './unlinkAccount.types';
import { mapBetterAuthApiErrorToCoreAuthError } from '../../shared/core.error';
import type { AuthServerFor } from '../../../server.types';
import { AuthServerTag } from '../../../server.service';

/**
 * Unlink an OAuth/social account from the authenticated user using Better Auth server API.
 *
 * @pure
 * @description Wraps auth.api.unlinkAccount in an Effect, converting Promise-based
 * errors into typed CoreAuthServerApiError failures. Removes a linked provider
 * account from the current user.
 *
 * @remarks
 * **Context-Based Dependency Injection:**
 * - Dependencies (authServer) are accessed via Effect's context layer
 * - Function accepts only the API parameters directly
 * - Effect executes lazily when run with provided context
 *
 * **Unlink Account Process:**
 * - Validates session from headers
 * - Verifies the provider account exists for the user
 * - Ensures user has at least one login method remaining
 * - Removes the provider account link
 * - Returns success confirmation
 *
 * **Error Handling:**
 * - Better Auth throws APIError instances on failure
 * - Common errors: Unauthorized (401), provider not found (404), last login method (400)
 * - Status codes extracted and preserved in CoreAuthServerApiError
 * - Error cause chain maintained for debugging
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - The unlink account parameters including body and headers (required)
 * @returns Effect requiring AuthServerFor context
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { unlinkAccountServerService } from './unlinkAccount.service';
 *
 * // Create the unlink account program
 * const program = unlinkAccountServerService({
 *   body: { providerId: 'google' },
 *   headers: requestHeaders
 * });
 *
 * // Provide context and execute
 * await Effect.runPromise(
 *   program.pipe(Effect.provideService(AuthServerTag, authServer))
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Handle provider not found error
 * import * as Effect from 'effect/Effect';
 *
 * const program = unlinkAccountServerService({
 *   body: { providerId: 'github' },
 *   headers: requestHeaders
 * });
 *
 * const handled = Effect.catchTag(program, 'CoreAuthServerApiError', (error) => {
 *   if (error.status === 404) {
 *     console.error('Provider not linked to this account');
 *     return Effect.fail(new Error('Provider not found'));
 *   }
 *   return Effect.fail(error);
 * });
 *
 * await Effect.runPromise(
 *   handled.pipe(Effect.provideService(AuthServerTag, authServer))
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Handle last login method error
 * import * as Effect from 'effect/Effect';
 *
 * const program = unlinkAccountServerService({
 *   body: { providerId: 'google' },
 *   headers: requestHeaders
 * });
 *
 * const handled = Effect.catchTag(program, 'CoreAuthServerApiError', (error) => {
 *   if (error.status === 400) {
 *     console.error('Cannot unlink last login method');
 *     return Effect.fail(new Error('Add another login method first'));
 *   }
 *   return Effect.fail(error);
 * });
 *
 * await Effect.runPromise(
 *   handled.pipe(Effect.provideService(AuthServerTag, authServer))
 * );
 * ```
 */
export const unlinkAccountServerService: unlinkAccountPropsFor = (params: AuthServerApiUnlinkAccountParamsFor<AuthServerFor>) =>
	Effect.flatMap(AuthServerTag, (authServer) =>
		Effect.tryPromise({
			try: () => authServer.api.unlinkAccount(params),
			catch: mapBetterAuthApiErrorToCoreAuthError,
		})
	);
