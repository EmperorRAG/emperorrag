/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/sign-in-email/signInEmail.service.ts
 * @description Server-side service for sign-in email operation using Better Auth API.
 */

import { Effect } from 'effect';
import { APIError } from 'better-auth/api';
import type { signInEmailServerProps } from './signInEmail.types.js';
import { EmailAuthServerApiError } from '../shared/email.error.js';

/**
 * Sign in a user via email and password using Better Auth server API.
 *
 * @pure
 * @description Wraps auth.api.signInEmail in an Effect, converting Promise-based
 * errors into typed EmailAuthServerApiError failures. Preserves HTTP status codes
 * from Better Auth APIError instances for proper error handling.
 *
 * @remarks
 * **Functional Programming Pattern:**
 * - Curried function: `(deps) => (params) => Effect`
 * - Stage 1: Inject dependencies (authServer)
 * - Stage 2: Accept operation parameters (body, headers)
 * - Stage 3: Return lazy Effect (executed when run)
 *
 * **Error Handling:**
 * - Better Auth throws APIError instances on failure
 * - Status codes extracted and preserved in EmailAuthServerApiError
 * - Error cause chain maintained for debugging
 * - Non-APIError exceptions handled gracefully
 *
 * **Effect-TS Benefits:**
 * - Lazy evaluation (Effect only runs when executed)
 * - Composable with other Effects via Effect.gen, pipe, etc.
 * - Typed error channel for exhaustive error handling
 * - Built-in retry/timeout capabilities
 *
 * @template T - The Better Auth server type with all plugin augmentations
 *
 * @param deps - Dependencies bundle containing Better Auth server instance
 * @returns Curried function accepting params and returning an Effect
 *
 * @example
 * ```typescript
 * import { Effect } from 'effect';
 * import { headers } from 'next/headers';
 * import { signInEmailServer } from './signInEmail.service.js';
 *
 * // Create the sign-in program
 * const program = Effect.gen(function* () {
 *   const result = yield* signInEmailServer({ authServer })({
 *     body: {
 *       email: 'user@example.com',
 *       password: 'securePassword123',
 *       rememberMe: true
 *     },
 *     headers: await headers()
 *   });
 *
 *   console.log('User signed in:', result.user.email);
 *   console.log('Session ID:', result.session.id);
 *   return result;
 * });
 *
 * // Execute the Effect
 * const result = await Effect.runPromise(program);
 * ```
 *
 * @example
 * ```typescript
 * // Error handling with Effect
 * import { Effect, Match } from 'effect';
 *
 * const program = signInEmailServer({ authServer })({
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
 * await Effect.runPromise(handled);
 * ```
 *
 * @example
 * ```typescript
 * // Composition with other operations
 * import { Effect } from 'effect';
 *
 * const signInAndFetchProfile = Effect.gen(function* () {
 *   // Sign in
 *   const authResult = yield* signInEmailServer({ authServer })({
 *     body: { email: 'user@example.com', password: 'password' },
 *     headers: requestHeaders
 *   });
 *
 *   // Fetch additional user data
 *   const profile = yield* fetchUserProfile(authResult.user.id);
 *
 *   return { ...authResult, profile };
 * });
 * ```
 */
export const signInEmailServer: signInEmailServerProps = (deps) => (params) => {
	const { authServer } = deps;

	return Effect.tryPromise({
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
	});
};
