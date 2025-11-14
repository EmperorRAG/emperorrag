import { Effect, pipe } from 'effect';
import type { AuthClient } from '../../../../client.js';
import type { SignOutOptions, signOutProps } from '../email.types.js';
import { EmailAuthApiError, EmailAuthInputError, type EmailAuthError } from '../email.error.js';
import { isSignOutOptions } from '../email.types.js';
import { type FetchResponse, unwrapFetchResponse, createApiErrorFactory, createValidateDeps } from '../shared/index.js';

/**
 * Internal payload type for Better Auth sign-out response.
 *
 * @description Represents the minimal success payload returned by Better Auth
 * sign-out API. The API returns a void-like response with no user or session data.
 */
type SignOutSuccessPayload = Readonly<{
	success?: boolean;
}>;

/**
 * Internal error type for Better Auth sign-out failures.
 *
 * @description Extends BetterFetchError with additional error metadata.
 */
type SignOutErrorPayload = Readonly<{
	status?: number;
	message?: string;
}> &
	Readonly<Record<string, unknown>>;

/**
 * Better Auth fetch response type for sign-out.
 *
 * @description Discriminated union representing the Better Fetch response pattern
 * for sign-out operations. Either contains data (success) or error (failure).
 *
 * @template TAuthClient - Optional AuthClient type for plugin awareness (defaults to AuthClient)
 */
type SignOutFetchResponse<TAuthClient extends AuthClient = AuthClient> = FetchResponse<SignOutSuccessPayload, SignOutErrorPayload, TAuthClient>;

// ============================================================================
// Layer 1: Validation
// ============================================================================

/**
 * Validates email authentication client dependencies.
 *
 * @description Factory-generated validator for sign-out operation dependencies.
 * Uses shared validation utility to ensure consistent error handling across operations.
 *
 * @see {@link createValidateDeps} from shared/validation.ts
 */
const validateDeps = createValidateDeps<AuthClient>('signOut');

/**
 * Validates sign-out options payload.
 *
 * @pure
 * @description Ensures the provided options (if any) satisfy the `SignOutOptions`
 * contract. Accepts `undefined` as valid input since options are optional.
 * Validates shape when provided (e.g., `all` must be boolean, `redirectTo` must be string).
 *
 * @fp-pattern Type-safe validation with optional input support
 *
 * @param options - Optional sign-out options to validate
 * @returns {Effect.Effect<SignOutOptions | undefined, EmailAuthInputError>}
 *   Success channel contains validated options or undefined, error channel contains
 *   validation failure.
 *
 * @example
 * ```typescript
 * const effect1 = validateSignOutOptions(undefined);
 * // => Effect.succeed(undefined)
 *
 * const effect2 = validateSignOutOptions({ all: true });
 * // => Effect.succeed({ all: true })
 *
 * const effect3 = validateSignOutOptions({ all: "invalid" });
 * // => Effect.fail(new EmailAuthInputError(...))
 * ```
 */
export const validateSignOutOptions = (options: unknown): Effect.Effect<SignOutOptions | undefined, EmailAuthInputError> =>
	isSignOutOptions(options)
		? Effect.succeed(options)
		: Effect.fail(
				new EmailAuthInputError(
					'Invalid sign-out options: must be undefined or an object with optional "all" (boolean), "redirectTo" (string), and "fetchOptions" (object with optional onSuccess/onError callbacks)'
				)
			);

// ============================================================================
// Layer 2: API Call
// ============================================================================

/**
 * Calls Better Auth sign-out API.
 *
 * @description Wraps the Better Auth client's `signOut` method in an Effect.
 * Accepts optional sign-out options (all sessions vs current, redirect URL).
 * The API requires session cookie in headers and returns minimal payload.
 *
 * @fp-pattern Effect wrapper for async operation with curried dependencies
 *
 * @param authClient - Better Auth client instance
 * @returns {(options?: SignOutOptions) => Effect.Effect<SignOutFetchResponse, EmailAuthApiError>}
 *   Curried function accepting options and returning Effect wrapping API call.
 *   Fails with EmailAuthApiError if the API call throws.
 *
 * @example
 * ```typescript
 * const apiCall = callSignOutApi(authClient);
 * const effect = apiCall({ all: true });
 * // => Effect.tryPromise wrapping authClient.signOut({ all: true })
 * ```
 */
export const callSignOutApi =
	<TAuthClient extends AuthClient>(authClient: TAuthClient) =>
	(options?: SignOutOptions): Effect.Effect<SignOutFetchResponse<TAuthClient>, EmailAuthApiError> =>
		Effect.tryPromise({
			try: async () => {
				const apiOptions = options
					? {
							...(options.all !== undefined && { all: options.all }),
							...(options.redirectTo !== undefined && { redirectTo: options.redirectTo }),
						}
					: undefined;

				const response = await authClient.signOut(apiOptions as Parameters<typeof authClient.signOut>[0]);

				return response as SignOutFetchResponse;
			},
			catch: (error) => new EmailAuthApiError('Sign-out API call failed', undefined, error),
		});

// ============================================================================
// Layer 3: Response Unwrapping
// ============================================================================

/**
 * Creates EmailAuthApiError from sign-out error payload.
 *
 * @description Factory-generated error constructor for sign-out operation.
 * Uses shared error factory utility to ensure consistent error handling.
 *
 * @see {@link createApiErrorFactory} from shared/response-unwrapping.ts
 */
const createSignOutApiError = createApiErrorFactory('Sign out');

// ============================================================================
// Layer 4: Callback Execution
// ============================================================================

/**
 * Executes onSuccess callback if provided in fetchOptions.
 *
 * @description Safely executes the user-provided `onSuccess` callback from
 * `SignOutOptions.fetchOptions`. Wraps callback in try-catch to prevent failures
 * from breaking the Effect pipeline. Silently handles callback errors and never
 * fails the Effect.
 *
 * @fp-pattern Safe side effect execution with error isolation
 *
 * @param options - Sign-out options potentially containing onSuccess callback
 * @returns {Effect.Effect<void, never>}
 *   Effect that executes callback and completes successfully regardless of outcome.
 *   Never fails (callback errors are silently handled, not propagated).
 *
 * @example
 * ```typescript
 * const options = {
 *   fetchOptions: {
 *     onSuccess: () => console.log('Signed out!')
 *   }
 * };
 * const effect = executeOnSuccessCallback(logger, options);
 * // => Effect.sync wrapping safe callback execution
 * ```
 */
export const executeOnSuccessCallback = (options?: SignOutOptions): Effect.Effect<void, never> =>
	Effect.sync(() => {
		const callback = options?.fetchOptions?.onSuccess;
		if (callback) {
			try {
				const result = callback();
				if (result instanceof Promise) {
					result.catch(() => {
						// Silently handle callback rejection
					});
				}
			} catch {
				// Silently handle callback error
			}
		}
	});

/**
 * Executes onError callback if provided in fetchOptions.
 *
 * @description Safely executes the user-provided `onError` callback from
 * `SignOutOptions.fetchOptions`. Wraps callback in try-catch to prevent failures
 * from breaking the Effect pipeline. Silently handles callback errors and never
 * fails the Effect.
 *
 * @fp-pattern Safe side effect execution with error isolation
 *
 * @param options - Sign-out options potentially containing onError callback
 * @param error - The error that triggered this callback
 * @returns {Effect.Effect<void, never>}
 *   Effect that executes callback and completes successfully regardless of outcome.
 *   Never fails (callback errors are silently handled, not propagated).
 *
 * @example
 * ```typescript
 * const options = {
 *   fetchOptions: {
 *     onError: (err) => console.error('Failed:', err)
 *   }
 * };
 * const effect = executeOnErrorCallback(logger, options, apiError);
 * // => Effect.sync wrapping safe callback execution
 * ```
 */
export const executeOnErrorCallback = (options: SignOutOptions | undefined, error: EmailAuthError): Effect.Effect<void, never> =>
	Effect.sync(() => {
		const callback = options?.fetchOptions?.onError;
		if (callback) {
			try {
				const result = callback(error);
				if (result instanceof Promise) {
					result.catch(() => {
						// Silently handle callback rejection
					});
				}
			} catch {
				// Silently handle callback error
			}
		}
	});

// ============================================================================
// Layer 5: Pipeline
// ============================================================================

/**
 * Signs out the current user session.
 *
 * @description Orchestrates the complete sign-out flow using Effect-TS for
 * functional composition. Validates dependencies and options, calls Better Auth
 * sign-out API, and executes callbacks. Returns void on success.
 *
 * Follows the established FP decomposition pattern with 5 layers:
 * 1. Validation (deps + options)
 * 2. API Call (authClient.signOut)
 * 3. Response Unwrapping (Better Fetch union)
 * 4. Callback Execution (onSuccess/onError from fetchOptions)
 * 5. Pipeline (Effect.gen orchestration)
 *
 * @fp-pattern Effect.gen pipeline with error handling and callback execution
 * @composition Composes validation → API call → unwrap → callbacks
 *
 * @param deps - Email authentication client dependencies
 * @returns {(options?: SignOutOptions) => Effect.Effect<void, EmailAuthError>}
 *   Curried function accepting optional sign-out options and returning Effect
 *   that completes with void on success or fails with EmailAuthError.
 *
 * @example
 * ```typescript
 * const signOutFn = signOut({ authClient, logger, telemetry });
 *
 * // Sign out current session only
 * const effect1 = signOutFn();
 * const result1 = await Effect.runPromise(effect1);
 * // => void
 *
 * // Sign out all sessions with redirect
 * const effect2 = signOutFn({ all: true, redirectTo: '/login' });
 * const result2 = await Effect.runPromise(effect2);
 * // => void
 *
 * // With callbacks
 * const effect3 = signOutFn({
 *   fetchOptions: {
 *     onSuccess: () => console.log('Signed out!'),
 *     onError: (error) => console.error('Failed:', error)
 *   }
 * });
 * const result3 = await Effect.runPromise(effect3);
 * // => void (after executing onSuccess callback)
 * ```
 */
export const signOut: signOutProps<AuthClient> =
	<TAuthClient extends AuthClient>(deps: { authClient: TAuthClient }) =>
	(options?: SignOutOptions): Effect.Effect<void, EmailAuthError> =>
		Effect.gen(function* () {
			// Layer 1: Validate dependencies
			const validatedDeps = yield* validateDeps(deps);

			// Layer 1: Validate options
			const validatedOptions = yield* validateSignOutOptions(options);

			// Layer 2: Call sign-out API
			const response = yield* callSignOutApi(validatedDeps.authClient)(validatedOptions);

			// Layer 3: Unwrap response
			yield* pipe(
				unwrapFetchResponse(createSignOutApiError)(response),
				Effect.tapError((error) => executeOnErrorCallback(validatedOptions, error)),
				Effect.catchAll((error) => Effect.fail(error))
			);

			// Layer 4: Execute onSuccess callback
			yield* executeOnSuccessCallback(validatedOptions);

			// Return void
			return;
		});
