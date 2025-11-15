/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/sign-out/signOut.service.ts
 * @description Server-side service for sign-out operation using Better Auth API.
 */

import { Effect } from 'effect';
import { APIError } from 'better-auth/api';
import type { signOutServerProps } from './signOut.types.js';
import { EmailAuthServerApiError } from '../shared/email.error.js';

/**
 * Terminate the current user session using Better Auth server API.
 *
 * @pure
 * @description Wraps auth.api.signOut in an Effect, converting Promise-based
 * errors into typed EmailAuthServerApiError failures. Invalidates the session
 * and clears authentication cookies.
 *
 * @remarks
 * **Functional Programming Pattern:**
 * - Curried function: `(deps) => (params) => Effect`
 * - Stage 1: Inject dependencies (authServer)
 * - Stage 2: Accept operation parameters (headers)
 * - Stage 3: Return lazy Effect (executed when run)
 *
 * **Sign-Out Process:**
 * - Reads session cookie from Headers
 * - Validates session is active
 * - Invalidates session in database
 * - Clears authentication cookies via response headers
 * - Returns success confirmation
 *
 * **Error Handling:**
 * - Better Auth throws APIError instances on failure
 * - Common errors: Invalid session (401), expired session (401)
 * - Status codes extracted and preserved in EmailAuthServerApiError
 * - Error cause chain maintained for debugging
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
 * import { signOutServer } from './signOut.service.js';
 *
 * // Create the sign-out program
 * const program = Effect.gen(function* () {
 *   yield* signOutServer({ authServer })({
 *     headers: await headers()
 *   });
 *
 *   console.log('User signed out successfully');
 * });
 *
 * // Execute the Effect
 * await Effect.runPromise(program);
 * ```
 *
 * @example
 * ```typescript
 * // Handle expired session gracefully
 * import { Effect } from 'effect';
 *
 * const program = signOutServer({ authServer })({
 *   headers: requestHeaders
 * });
 *
 * const handled = Effect.catchTag(program, 'EmailAuthServerApiError', (error) => {
 *   if (error.status === 401) {
 *     console.log('Session already expired or invalid');
 *     return Effect.succeed(undefined); // Treat as success
 *   }
 *   return Effect.fail(error);
 * });
 *
 * await Effect.runPromise(handled);
 * ```
 *
 * @example
 * ```typescript
 * // Sign-out with cleanup actions
 * import { Effect } from 'effect';
 *
 * const signOutWithCleanup = Effect.gen(function* () {
 *   // Sign out user
 *   yield* signOutServer({ authServer })({
 *     headers: requestHeaders
 *   });
 *
 *   // Clear user-specific cache
 *   yield* clearUserCache();
 *
 *   // Log sign-out event
 *   yield* logSignOutEvent(userId);
 *
 *   console.log('Sign-out complete with cleanup');
 * });
 * ```
 */
export const signOutServer: signOutServerProps = (deps) => (params) => {
	const { authServer } = deps;

	return Effect.tryPromise({
		try: () => authServer.api.signOut(params),
		catch: (error) => {
			// Better Auth server throws APIError instances with status codes
			if (error instanceof APIError) {
				// Convert status to number (APIError.status is Status string union)
				const status = typeof error.status === 'number' ? error.status : parseInt(error.status as string, 10) || undefined;
				return new EmailAuthServerApiError(error.message, status, error);
			}
			// Handle non-APIError exceptions
			const message = error instanceof Error ? error.message : 'Sign out failed';
			return new EmailAuthServerApiError(message, undefined, error);
		},
	});
};
