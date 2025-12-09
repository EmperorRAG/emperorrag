/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/sign-in-email/signInEmail.service.ts
 * @description Server-side service for sign-in email operation using Better Auth API.
 */

import * as Effect from 'effect/Effect';
import { APIError } from 'better-auth/api';
import type { AuthServerApiSignInEmailParamsFor, signInEmailPropsFor } from './signInEmail.types';
import { EmailAuthServerApiError } from '../shared/email.error';
import type { AuthServerFor } from '../../../server.types';
import { EmailAuthServerServiceTag } from '../shared/email.service';

/**
 * Sign in a user via email and password using Better Auth server API.
 *
 * @pure
 * @description Wraps auth.api.signInEmail in an Effect, converting Promise-based
 * errors into typed EmailAuthServerApiError failures. Authenticates user and
 * creates a session.
 *
 * @remarks
 * **Context-Based Dependency Injection:**
 * - Dependencies (authServer) are provided via Effect's context layer (EmailAuthServerService)
 * - Function accepts only the API parameters directly
 * - Effect executes lazily when run with provided context
 *
 * **Authentication Process:**
 * - Validates credentials against stored user data
 * - Verifies password hash
 * - Creates session record in database
 * - Sets session cookies (if headers provided)
 * - Returns user data and session information
 *
 * **Error Handling:**
 * - Better Auth throws APIError instances on failure
 * - Common errors: Invalid credentials (401), user not found (404)
 * - Status codes extracted and preserved in EmailAuthServerApiError
 * - Error cause chain maintained for debugging
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param params - Parameters including body with credentials and optional headers
 * @returns Effect requiring EmailAuthServerService context
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 * import { signInEmailServerService } from './signInEmail.service';
 * import { EmailAuthServerServiceTag } from '../shared/email.service';
 *
 * const program = signInEmailServerService({
 *   body: {
 *     email: 'user@example.com',
 *     password: 'securePassword123',
 *     rememberMe: true
 *   },
 *   headers: requestHeaders
 * });
 *
 * const result = await Effect.runPromise(
 *   Effect.provideService(program, EmailAuthServerServiceTag, { authServer })
 * );
 * ```
 *
 * @example
 * ```typescript
 * // Error handling with Effect
 * import * as Effect from 'effect/Effect';
 *
 * const program = signInEmailServerService({
 *   body: { email: 'user@example.com', password: 'wrong' },
 *   headers: requestHeaders
 * });
 *
 * const handled = Effect.catchTag(program, 'EmailAuthServerApiError', (error) => {
 *   if (error.status === 401) {
 *     return Effect.fail(new Error('Invalid credentials'));
 *   }
 *   return Effect.fail(error);
 * });
 *
 * await Effect.runPromise(
 *   Effect.provideService(handled, EmailAuthServerServiceTag, { authServer })
 * );
 * ```
 */
export const signInEmailServerService: signInEmailPropsFor = <T extends AuthServerFor = AuthServerFor>(params: AuthServerApiSignInEmailParamsFor<T>) =>
	Effect.flatMap(EmailAuthServerServiceTag, ({ authServer }) =>
		Effect.tryPromise({
			try: () => authServer.api.signInEmail(params),
			catch: (error) => {
				// Better Auth server throws APIError instances with status codes
				if (error instanceof APIError) {
					// Convert status to number (APIError.status is Status string union)
					const status = typeof error.status === 'number' ? error.status : parseInt(error.status as string, 10) || undefined;
					return new EmailAuthServerApiError(error.message, status, error);
				}
				// Handle non-APIError exceptions
				const message = error instanceof Error ? error.message : 'Sign in failed';
				return new EmailAuthServerApiError(message, undefined, error);
			},
		})
	);
