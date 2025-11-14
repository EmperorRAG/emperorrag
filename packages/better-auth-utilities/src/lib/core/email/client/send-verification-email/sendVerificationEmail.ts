/**
 * Email verification sender for Better Auth.
 *
 * @description This module provides functionality to send verification emails through
 * Better Auth. Follows the functional programming pattern with Effect-TS for type-safe
 * error handling and composable operations. Significantly simpler than signUpEmail as
 * it returns void with no session or payload extraction needed.
 *
 * @module sendVerificationEmail
 */

import { Effect } from 'effect';
import type { AuthClient } from '../../../../client.js';
import type { VerificationEmailInput, sendVerificationEmailProps } from '../email.types.js';
import { EmailAuthInputError, EmailAuthApiError } from '../email.error.js';
import { isVerificationEmailInput } from '../email.types.js';
import { createValidateDeps, unwrapFetchResponse, createApiErrorFactory, type FetchResponse } from '../shared/index.js';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Error payload returned by Better Auth on verification email failure.
 *
 * @description Matches Better Auth's standard error response structure.
 * Status codes typically include 400 (invalid email), 429 (rate limit), 500 (server error).
 */
type VerificationEmailErrorPayload = Readonly<{
	status?: number;
	message?: string;
}> &
	Readonly<Record<string, unknown>>;

// ============================================================================
// Layer 1: Validation
// ============================================================================

/**
 * Validates email auth client dependencies.
 *
 * @description Factory-generated validator for send verification email operation dependencies.
 * Uses shared validation utility to ensure consistent error handling across operations.
 *
 * @see {@link createValidateDeps} from shared/validation.ts
 */
const validateDeps = createValidateDeps<AuthClient>('sendVerificationEmail');

/**
 * Validates verification email input payload.
 *
 * @pure
 * @fp-pattern Higher-order validation with Effect error channel
 *
 * @param input - Input payload to validate
 * @returns {Effect.Effect<VerificationEmailInput, EmailAuthInputError>}
 *
 * @example
 * ```typescript
 * const validated = validateVerificationEmailInput({ email: 'user@example.com', callbackUrl: 'https://app.com/verify' });
 * // => Effect.succeed(input) or Effect.fail(new EmailAuthInputError(...))
 * ```
 */
export const validateVerificationEmailInput = (input: unknown): Effect.Effect<VerificationEmailInput, EmailAuthInputError> =>
	isVerificationEmailInput(input) ? Effect.succeed(input) : Effect.fail(new EmailAuthInputError('Invalid verification email payload'));

// ============================================================================
// Layer 2: API Calls
// ============================================================================

/**
 * Calls Better Auth send verification email API.
 *
 * @description Wraps the Better Auth client sendVerificationEmail call in an Effect,
 * converting Promise rejections to typed EmailAuthApiError failures. Returns void on
 * success as verification emails do not return payload data.
 *
 * @param authClient - Better Auth client instance
 * @returns {Function} Curried function accepting verification email input
 *
 * @example
 * ```typescript
 * const program = pipe(
 *   validateVerificationEmailInput(input),
 *   Effect.flatMap(callSendVerificationEmailApi(authClient))
 * );
 * ```
 */
export const callSendVerificationEmailApi =
	<TAuthClient extends AuthClient>(authClient: TAuthClient) =>
	(input: VerificationEmailInput): Effect.Effect<FetchResponse<void, VerificationEmailErrorPayload>, EmailAuthApiError> =>
		Effect.tryPromise({
			try: () =>
				authClient.sendVerificationEmail({
					email: input.email,
					callbackURL: input.callbackUrl,
				}) as Promise<FetchResponse<void, VerificationEmailErrorPayload>>,
			catch: (error) => new EmailAuthApiError('Send verification email API call failed', undefined, error),
		});

// ============================================================================
// Layer 3: Response Unwrapping
// ============================================================================

/**
 * Creates EmailAuthApiError from verification email error payload.
 *
 * @description Factory-generated error constructor for send verification email operation.
 * Uses shared error factory utility to ensure consistent error handling.
 *
 * @see {@link createApiErrorFactory} from shared/response-unwrapping.ts
 */
const createSendVerificationEmailApiError = createApiErrorFactory('Send verification email');

// ============================================================================
// Main Function: Composed Pipeline
// ============================================================================

/**
 * Sends a verification email through Better Auth.
 *
 * @description High-level function that composes validation, API calls, and
 * error handling into a single Effect pipeline. Significantly simpler than signUpEmail
 * as it returns void with no session or payload extraction layers.
 *
 * @fp-pattern Effect.gen for sequential composition with error propagation
 * @composition Combines 3 layers: Validation → API → Unwrapping
 *
 * Architecture (3 layers):
 * 1. Validation: Dependencies and input validation
 * 2. API Call: Better Auth sendVerificationEmail endpoint
 * 3. Response Unwrapping: Error handling for Better Fetch responses
 *
 * Error Channel:
 * - EmailAuthDependenciesError: Invalid dependencies (missing authClient, wrong shape)
 * - EmailAuthInputError: Invalid input (missing email, invalid format)
 * - EmailAuthApiError: API call failed (network error, 400/429/500 status)
 *
 * @param deps - Email authentication client dependencies bundle
 * @returns {Function} Curried function accepting verification email input
 *
 * @example
 * ```typescript
 * const send = sendVerificationEmail({ authClient });
 * const program = send({ email: 'user@example.com', callbackUrl: 'https://app.com/verify' });
 *
 * // Execute the Effect
 * const result = await Effect.runPromise(program);
 * // => void (on success)
 *
 * // Or handle errors
 * const result = await Effect.runPromise(
 *   Effect.catchAll(program, (error) => {
 *     if (error._tag === 'EmailAuthApiError') {
 *       console.error('API failed:', error.status, error.message);
 *     }
 *     return Effect.fail(error);
 *   })
 * );
 * ```
 */
export const sendVerificationEmail: sendVerificationEmailProps = (deps) => (input) =>
	Effect.gen(function* () {
		// ====================================================================
		// Layer 1: Validation
		// ====================================================================

		// Validate dependencies bundle
		const validatedDeps = yield* validateDeps(deps);

		const { authClient } = validatedDeps;

		// Validate input payload
		const validatedInput = yield* validateVerificationEmailInput(input);

		// ====================================================================
		// Layer 2: API Call
		// ====================================================================

		// Call Better Auth sendVerificationEmail endpoint
		const apiResponse = yield* callSendVerificationEmailApi(authClient)(validatedInput);

		// ====================================================================
		// Layer 3: Response Unwrapping
		// ====================================================================

		// Unwrap Better Fetch discriminated union response
		// For void responses, unwrapFetchResponse simply checks for errors
		const unwrap = unwrapFetchResponse(createSendVerificationEmailApiError);
		yield* unwrap(apiResponse);

		// Return void (no payload data for verification email operations)
	});
