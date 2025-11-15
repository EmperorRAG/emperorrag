/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/sign-up-email/signUpEmail.service.ts
 * @description Server-side service for sign-up email operation using Better Auth API.
 */

import { Effect } from 'effect';
import { APIError } from 'better-auth/api';
import type { signUpEmailServerProps } from './signUpEmail.types.js';
import { EmailAuthServerApiError } from '../shared/email.error.js';

/**
 * Register a new user via email and password using Better Auth server API.
 *
 * @pure
 * @description Wraps auth.api.signUpEmail in an Effect, converting Promise-based
 * errors into typed EmailAuthServerApiError failures. Creates both user account
 * and initial session in a single operation.
 *
 * @remarks
 * **Functional Programming Pattern:**
 * - Curried function: `(deps) => (params) => Effect`
 * - Stage 1: Inject dependencies (authServer)
 * - Stage 2: Accept operation parameters (body, headers)
 * - Stage 3: Return lazy Effect (executed when run)
 *
 * **Registration Process:**
 * - Validates email uniqueness (throws error if exists)
 * - Hashes password securely (handled by Better Auth)
 * - Creates user record in database
 * - Creates initial session (if headers provided)
 * - Returns user data and session information
 *
 * **Error Handling:**
 * - Better Auth throws APIError instances on failure
 * - Common errors: Email already exists (409), validation failures (400)
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
 * import { signUpEmailServer } from './signUpEmail.service.js';
 *
 * // Create the registration program
 * const program = Effect.gen(function* () {
 *   const result = yield* signUpEmailServer({ authServer })({
 *     body: {
 *       name: 'Alice Johnson',
 *       email: 'alice@example.com',
 *       password: 'securePassword123',
 *       image: 'https://example.com/avatars/alice.jpg'
 *     },
 *     headers: await headers()
 *   });
 *
 *   console.log('User registered:', result.user.email);
 *   console.log('User ID:', result.user.id);
 *   console.log('Session created:', result.session.id);
 *   return result;
 * });
 *
 * // Execute the Effect
 * const result = await Effect.runPromise(program);
 * ```
 *
 * @example
 * ```typescript
 * // Handle duplicate email error
 * import { Effect } from 'effect';
 *
 * const program = signUpEmailServer({ authServer })({
 *   body: {
 *     name: 'Bob Smith',
 *     email: 'existing@example.com',
 *     password: 'password'
 *   },
 *   headers: requestHeaders
 * });
 *
 * const handled = Effect.catchTag(program, 'EmailAuthServerApiError', (error) => {
 *   if (error.status === 409) {
 *     console.error('Email already registered');
 *     return Effect.fail(new Error('Please use a different email'));
 *   }
 *   return Effect.fail(error);
 * });
 *
 * await Effect.runPromise(handled);
 * ```
 *
 * @example
 * ```typescript
 * // Registration with post-signup actions
 * import { Effect } from 'effect';
 *
 * const registerAndWelcome = Effect.gen(function* () {
 *   // Register user
 *   const result = yield* signUpEmailServer({ authServer })({
 *     body: {
 *       name: 'Carol White',
 *       email: 'carol@example.com',
 *       password: 'securePassword123'
 *     },
 *     headers: requestHeaders
 *   });
 *
 *   // Send welcome email
 *   yield* sendWelcomeEmail(result.user.email);
 *
 *   // Create default user preferences
 *   yield* createUserPreferences(result.user.id);
 *
 *   return result;
 * });
 * ```
 */
export const signUpEmailServer: signUpEmailServerProps = (deps) => (params) => {
	const { authServer } = deps;

	return Effect.tryPromise({
		try: () => authServer.api.signUpEmail(params),
		catch: (error) => {
			// Better Auth server throws APIError instances with status codes
			if (error instanceof APIError) {
				// Convert status to number (APIError.status is Status string union)
				const status = typeof error.status === 'number' ? error.status : parseInt(error.status as string, 10) || undefined;
				return new EmailAuthServerApiError(error.message, status, error);
			}
			// Handle non-APIError exceptions
			const message = error instanceof Error ? error.message : 'Sign up failed';
			return new EmailAuthServerApiError(message, undefined, error);
		},
	});
};
