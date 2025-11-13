import { Effect, pipe } from 'effect';
import type { AuthClient } from '../../../../client.js';
import type { EmailAuthClientDeps, SignOutOptions, signOutProps } from '../email.types.js';
import {
	EmailAuthApiError,
	EmailAuthDependenciesError,
	EmailAuthInputError,
	type EmailAuthError,
} from '../email.error.js';
import { isEmailAuthClientDeps, isSignOutOptions } from '../email.types.js';

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
 */
type SignOutFetchResponse =
	| Readonly<{ data: SignOutSuccessPayload; error: null }>
	| Readonly<{ data: null; error: SignOutErrorPayload }>;

// ============================================================================
// Layer 1: Validation
// ============================================================================

/**
 * Validates email authentication client dependencies.
 *
 * @pure
 * @description Ensures the provided dependencies bundle satisfies the
 * `EmailAuthClientDeps` contract. Validates the presence of required `authClient`
 * and optional adapters (logger, telemetry, featureFlags).
 *
 * @fp-pattern Higher-order function with type-safe validation
 *
 * @param deps - Dependencies bundle to validate
 * @returns {Effect.Effect<EmailAuthClientDeps<TAuthClient>, EmailAuthDependenciesError>}
 *   Success channel contains validated deps, error channel contains validation failure.
 *
 * @example
 * ```typescript
 * const deps = { authClient, logger };
 * const effect = validateDeps(deps);
 * // => Effect.succeed(deps) or Effect.fail(new EmailAuthDependenciesError(...))
 * ```
 */
export const validateDeps = <TAuthClient extends AuthClient>(
	deps: unknown
): Effect.Effect<EmailAuthClientDeps<TAuthClient>, EmailAuthDependenciesError> =>
	isEmailAuthClientDeps<TAuthClient>(deps)
		? Effect.succeed(deps)
		: Effect.fail(
				new EmailAuthDependenciesError(
					'Invalid email authentication dependencies: authClient is required and must satisfy AuthClient contract'
				)
		  );

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
export const validateSignOutOptions = (
	options: unknown
): Effect.Effect<SignOutOptions | undefined, EmailAuthInputError> =>
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
	(options?: SignOutOptions): Effect.Effect<SignOutFetchResponse, EmailAuthApiError> =>
		Effect.tryPromise({
			try: async () => {
				const apiOptions = options
					? {
							...(options.all !== undefined && { all: options.all }),
							...(options.redirectTo !== undefined && { redirectTo: options.redirectTo }),
					  }
					: undefined;

				const response = await authClient.signOut(
					apiOptions as Parameters<typeof authClient.signOut>[0]
				);

				return response as SignOutFetchResponse;
			},
			catch: (error) =>
				new EmailAuthApiError(
					'Sign-out API call failed',
					undefined,
					error
				),
		});

// ============================================================================
// Layer 3: Response Unwrapping
// ============================================================================

/**
 * Type guard for Better Fetch failure responses.
 *
 * @pure
 * @description Discriminates between success and error branches of Better Fetch
 * union type `{ data: T, error: null } | { data: null, error: E }`. Returns true
 * when response represents a failure (data is null, error is present).
 *
 * @fp-pattern Type guard for discriminated union
 *
 * @param response - Better Fetch response to check
 * @returns {boolean} True if response is a failure, false if success
 *
 * @example
 * ```typescript
 * const success = { data: { success: true }, error: null };
 * const failure = { data: null, error: { message: 'Failed' } };
 *
 * isFetchFailure(success); // => false
 * isFetchFailure(failure); // => true
 * ```
 */
export const isFetchFailure = <TData, TError>(
	response: Readonly<{ data: TData | null; error: TError | null }>
): response is Readonly<{ data: null; error: TError }> => response.data === null && response.error !== null;

/**
 * Unwraps Better Fetch response into Effect channels.
 *
 * @pure
 * @description Higher-order function that unwraps Better Fetch discriminated union
 * `{ data: T, error: null } | { data: null, error: E }` into Effect's error and
 * success channels. Accepts an error factory to transform fetch errors into
 * domain-specific error types.
 *
 * @fp-pattern Higher-order function with error factory injection
 * @composition Composes `isFetchFailure` type guard with Effect constructors
 *
 * @param errorFactory - Factory function to create domain error from fetch error
 * @returns {(response: FetchResponse) => Effect.Effect<TData, TDomainError>}
 *   Function that unwraps response into Effect channels.
 *
 * @example
 * ```typescript
 * const unwrap = unwrapFetchResponse(createSignOutApiError);
 * const effect = unwrap({ data: { success: true }, error: null });
 * // => Effect.succeed({ success: true })
 *
 * const errorEffect = unwrap({ data: null, error: { message: 'Failed' } });
 * // => Effect.fail(new EmailAuthApiError(...))
 * ```
 */
export const unwrapFetchResponse =
	<TData, TError, TDomainError extends EmailAuthError>(errorFactory: (error: TError) => TDomainError) =>
	(
		response: Readonly<{ data: TData | null; error: TError | null }>
	): Effect.Effect<TData, TDomainError> =>
		isFetchFailure(response)
			? Effect.fail(errorFactory(response.error))
			: Effect.succeed(response.data as TData);

/**
 * Creates EmailAuthApiError from sign-out error payload.
 *
 * @pure
 * @description Factory function that transforms Better Auth fetch error into
 * domain-specific `EmailAuthApiError`. Extracts status code and message from
 * error payload and preserves original error as cause.
 *
 * @fp-pattern Error factory for domain error construction
 *
 * @param error - Better Auth fetch error payload
 * @returns {EmailAuthApiError} Domain error with status and cause
 *
 * @example
 * ```typescript
 * const error = { status: 401, message: 'Unauthorized' };
 * const domainError = createSignOutApiError(error);
 * // => EmailAuthApiError { message: 'Sign-out failed', status: 401, cause: error }
 * ```
 */
export const createSignOutApiError = (error: SignOutErrorPayload): EmailAuthApiError =>
	new EmailAuthApiError(
		`Sign-out failed${error.message ? `: ${error.message}` : ''}`,
		error.status,
		error
	);

// ============================================================================
// Layer 4: Callback Execution
// ============================================================================

/**
 * Executes onSuccess callback if provided in fetchOptions.
 *
 * @description Safely executes the user-provided `onSuccess` callback from
 * `SignOutOptions.fetchOptions`. Wraps callback in try-catch to prevent failures
 * from breaking the Effect pipeline. Logs warnings on callback errors but never
 * fails the Effect.
 *
 * @fp-pattern Safe side effect execution with error isolation
 *
 * @param logger - Optional logger for warning messages
 * @param options - Sign-out options potentially containing onSuccess callback
 * @returns {Effect.Effect<void, never>}
 *   Effect that executes callback and completes successfully regardless of outcome.
 *   Never fails (callback errors are logged, not propagated).
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
export const executeOnSuccessCallback = (
	logger: EmailAuthClientDeps['logger'],
	options?: SignOutOptions
): Effect.Effect<void, never> =>
	Effect.sync(() => {
		const callback = options?.fetchOptions?.onSuccess;
		if (!callback) {
			return;
		}

		try {
			const result = callback();
			if (result instanceof Promise) {
				result.catch((error) => {
					logger?.warn?.('Sign-out onSuccess callback rejected', {
						operation: 'signOut',
						error: error instanceof Error ? error.message : String(error),
					});
				});
			}
		} catch (error) {
			logger?.warn?.('Sign-out onSuccess callback threw error', {
				operation: 'signOut',
				error: error instanceof Error ? error.message : String(error),
			});
		}
	});

/**
 * Executes onError callback if provided in fetchOptions.
 *
 * @description Safely executes the user-provided `onError` callback from
 * `SignOutOptions.fetchOptions`. Wraps callback in try-catch to prevent failures
 * from breaking the Effect pipeline. Logs warnings on callback errors but never
 * fails the Effect.
 *
 * @fp-pattern Safe side effect execution with error isolation
 *
 * @param logger - Optional logger for warning messages
 * @param options - Sign-out options potentially containing onError callback
 * @param error - The error that triggered this callback
 * @returns {Effect.Effect<void, never>}
 *   Effect that executes callback and completes successfully regardless of outcome.
 *   Never fails (callback errors are logged, not propagated).
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
export const executeOnErrorCallback = (
	logger: EmailAuthClientDeps['logger'],
	options: SignOutOptions | undefined,
	error: EmailAuthError
): Effect.Effect<void, never> =>
	Effect.sync(() => {
		const callback = options?.fetchOptions?.onError;
		if (!callback) {
			return;
		}

		try {
			const result = callback(error);
			if (result instanceof Promise) {
				result.catch((callbackError) => {
					logger?.warn?.('Sign-out onError callback rejected', {
						operation: 'signOut',
						error: callbackError instanceof Error ? callbackError.message : String(callbackError),
					});
				});
			}
		} catch (callbackError) {
			logger?.warn?.('Sign-out onError callback threw error', {
				operation: 'signOut',
				error: callbackError instanceof Error ? callbackError.message : String(callbackError),
			});
		}
	});

// ============================================================================
// Layer 5: Logging
// ============================================================================

/**
 * Logs validation failure for dependencies or input.
 *
 * @description Side effect that logs validation errors using the provided logger.
 * Wrapped in Effect.sync to integrate with Effect pipeline. Never fails the Effect.
 *
 * @fp-pattern Side effect wrapper for logging
 *
 * @param logger - Optional logger for error messages
 * @param error - Validation error to log
 * @returns {Effect.Effect<void, never>}
 *   Effect that logs error and completes successfully. Never fails.
 *
 * @example
 * ```typescript
 * const effect = logValidationFailure(logger, new EmailAuthInputError('Invalid'));
 * // => Effect.sync wrapping logger.error call
 * ```
 */
export const logValidationFailure = (
	logger: EmailAuthClientDeps['logger'],
	error: EmailAuthDependenciesError | EmailAuthInputError
): Effect.Effect<void, never> =>
	Effect.sync(() => {
		logger?.error?.('Sign-out validation failed', {
			operation: 'signOut',
			errorType: error._tag,
			message: error.message,
		});
	});

/**
 * Logs API call failure.
 *
 * @description Side effect that logs API errors using the provided logger.
 * Wrapped in Effect.sync to integrate with Effect pipeline. Never fails the Effect.
 *
 * @fp-pattern Side effect wrapper for logging
 *
 * @param logger - Optional logger for error messages
 * @param error - API error to log
 * @returns {Effect.Effect<void, never>}
 *   Effect that logs error and completes successfully. Never fails.
 *
 * @example
 * ```typescript
 * const effect = logApiFailure(logger, new EmailAuthApiError('Failed', 401));
 * // => Effect.sync wrapping logger.error call
 * ```
 */
export const logApiFailure = (
	logger: EmailAuthClientDeps['logger'],
	error: EmailAuthApiError
): Effect.Effect<void, never> =>
	Effect.sync(() => {
		logger?.error?.('Sign-out API call failed', {
			operation: 'signOut',
			errorType: error._tag,
			message: error.message,
			status: error.status,
		});
	});

/**
 * Logs successful sign-out completion.
 *
 * @description Side effect that logs success using the provided logger and telemetry.
 * Wrapped in Effect.sync to integrate with Effect pipeline. Never fails the Effect.
 *
 * @fp-pattern Side effect wrapper for logging and telemetry
 *
 * @param logger - Optional logger for info messages
 * @param telemetry - Optional telemetry tracker
 * @param options - Sign-out options used in the operation
 * @returns {Effect.Effect<void, never>}
 *   Effect that logs success and completes successfully. Never fails.
 *
 * @example
 * ```typescript
 * const effect = logSignOutSuccess(logger, telemetry, { all: true });
 * // => Effect.sync wrapping logger.info and telemetry.trackEvent calls
 * ```
 */
export const logSignOutSuccess = (
	logger: EmailAuthClientDeps['logger'],
	telemetry: EmailAuthClientDeps['telemetry'],
	options?: SignOutOptions
): Effect.Effect<void, never> =>
	Effect.sync(() => {
		logger?.info?.('Sign-out completed successfully', {
			operation: 'signOut',
			allSessions: options?.all ?? false,
			hasRedirect: options?.redirectTo !== undefined,
		});

		telemetry?.trackEvent?.('auth.signOut.success', {
			allSessions: options?.all ?? false,
			hasRedirect: options?.redirectTo !== undefined,
		});
	});

// ============================================================================
// Layer 6: Pipeline
// ============================================================================

/**
 * Signs out the current user session.
 *
 * @description Orchestrates the complete sign-out flow using Effect-TS for
 * functional composition. Validates dependencies and options, calls Better Auth
 * sign-out API, executes callbacks, and logs results. Returns void on success.
 *
 * Follows the established FP decomposition pattern with 6 layers:
 * 1. Validation (deps + options)
 * 2. API Call (authClient.signOut)
 * 3. Response Unwrapping (Better Fetch union)
 * 4. Callback Execution (onSuccess/onError from fetchOptions)
 * 5. Logging (validation, API, success)
 * 6. Pipeline (Effect.gen orchestration)
 *
 * @fp-pattern Effect.gen pipeline with error handling and callback execution
 * @composition Composes validation → API call → unwrap → callbacks → logging
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
	<TAuthClient extends AuthClient>(deps: EmailAuthClientDeps<TAuthClient>) =>
	(options?: SignOutOptions): Effect.Effect<void, EmailAuthError> =>
		Effect.gen(function* () {
			// Layer 1: Validate dependencies
			const validatedDeps = yield* pipe(
				validateDeps<TAuthClient>(deps),
				Effect.tapError((error) => logValidationFailure(deps.logger, error))
			);

			// Layer 1: Validate options
			const validatedOptions = yield* pipe(
				validateSignOutOptions(options),
				Effect.tapError((error) => logValidationFailure(validatedDeps.logger, error))
			);

			// Layer 2: Call sign-out API
			const response = yield* callSignOutApi(validatedDeps.authClient)(validatedOptions);

			// Layer 3: Unwrap response
			yield* pipe(
				unwrapFetchResponse(createSignOutApiError)(response),
				Effect.tapError((error) => logApiFailure(validatedDeps.logger, error)),
				Effect.tapError((error) =>
					executeOnErrorCallback(validatedDeps.logger, validatedOptions, error)
				),
				Effect.catchAll((error) => Effect.fail(error))
			);

			// Layer 4: Execute onSuccess callback
			yield* executeOnSuccessCallback(validatedDeps.logger, validatedOptions);

			// Layer 5: Log success
			yield* logSignOutSuccess(validatedDeps.logger, validatedDeps.telemetry, validatedOptions);

			// Return void
			return;
		});
