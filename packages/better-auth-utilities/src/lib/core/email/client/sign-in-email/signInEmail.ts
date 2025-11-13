import { Effect, pipe } from 'effect';
import type { BetterFetchError } from '@better-fetch/fetch';
import type {
	EmailAuthClientDeps,
	SignInEmailInput,
	SignInEmailResult,
	signInEmailProps,
} from '../email.types.js';
import { isEmailAuthClientDeps, isSignInEmailInput } from '../email.types.js';
import {
	EmailAuthDependenciesError,
	EmailAuthInputError,
	EmailAuthApiError,
	EmailAuthDataMissingError,
	EmailAuthSessionError,
	type EmailAuthError,
} from '../email.error.js';
import type {
	AuthClient,
	AuthClientSessionUserOf,
	AuthClientSessionUserSessionOf,
} from '../../../../client.js';

// ============================================================================
// Type Definitions
// ============================================================================

type FetchSuccess<TData> = Readonly<{ data: TData; error: null }>;
type FetchFailure<TError> = Readonly<{ data: null; error: TError }>;
type FetchResponse<TData, TError> = FetchSuccess<TData> | FetchFailure<TError>;

type SignInSuccessPayload<TAuthClient extends AuthClient> = Readonly<{
	user: AuthClientSessionUserOf<TAuthClient>;
	session: AuthClientSessionUserSessionOf<TAuthClient>; // Always present for sign-in
	requiresVerification?: boolean; // Optional verification flag
}>;

type SignInErrorPayload = BetterFetchError & Readonly<Record<string, unknown>>;

// ============================================================================
// Layer 1: Validation
// ============================================================================

/**
 * Validates email auth client dependencies.
 *
 * @pure
 * @fp-pattern Higher-order validation with Effect error channel
 *
 * @param deps - Dependencies to validate
 * @returns {Effect.Effect<EmailAuthClientDeps<TAuthClient>, EmailAuthDependenciesError>}
 *
 * @example
 * ```typescript
 * const validated = validateDeps(deps);
 * // => Effect.succeed(deps) or Effect.fail(new EmailAuthDependenciesError(...))
 * ```
 */
export const validateDeps = <TAuthClient extends AuthClient>(
	deps: unknown
): Effect.Effect<EmailAuthClientDeps<TAuthClient>, EmailAuthDependenciesError> =>
	isEmailAuthClientDeps<TAuthClient>(deps)
		? Effect.succeed(deps)
		: Effect.fail(new EmailAuthDependenciesError('Invalid dependencies provided to signInEmail'));

/**
 * Validates sign-in email input payload.
 *
 * @pure
 * @fp-pattern Higher-order validation with Effect error channel
 *
 * @param input - Input payload to validate
 * @returns {Effect.Effect<SignInEmailInput, EmailAuthInputError>}
 *
 * @example
 * ```typescript
 * const validated = validateSignInInput({ email: 'user@example.com', password: 'secret' });
 * // => Effect.succeed(input) or Effect.fail(new EmailAuthInputError(...))
 * ```
 */
export const validateSignInInput = (
	input: unknown
): Effect.Effect<SignInEmailInput, EmailAuthInputError> =>
	isSignInEmailInput(input)
		? Effect.succeed(input)
		: Effect.fail(new EmailAuthInputError('Invalid sign in payload'));

// ============================================================================
// Layer 2: API Call
// ============================================================================

/**
 * Calls Better Auth sign-in API with provided credentials.
 *
 * @description Wraps the Better Auth client sign-in call in an Effect, converting
 * Promise rejections to typed EmailAuthApiError failures.
 *
 * @param authClient - Better Auth client instance
 * @returns {Function} Curried function accepting sign-in input
 *
 * @example
 * ```typescript
 * const program = pipe(
 *   validateSignInInput(input),
 *   Effect.flatMap(callSignInApi(authClient))
 * );
 * ```
 */
export const callSignInApi =
	<TAuthClient extends AuthClient>(authClient: TAuthClient) =>
	(
		input: SignInEmailInput
	): Effect.Effect<
		FetchResponse<SignInSuccessPayload<TAuthClient>, SignInErrorPayload>,
		EmailAuthApiError
	> =>
		Effect.tryPromise({
			try: () =>
				authClient.signIn.email({
					email: input.email,
					password: input.password,
					rememberMe: input.rememberMe,
					callbackURL: input.callbackUrl,
				}) as Promise<FetchResponse<SignInSuccessPayload<TAuthClient>, SignInErrorPayload>>,
			catch: (error) => new EmailAuthApiError('Sign in API call failed', undefined, error),
		});

// ============================================================================
// Layer 3: Response Unwrapping
// ============================================================================

/**
 * Type guard for Better Fetch failure responses.
 *
 * @pure
 * @description Checks if a Better Fetch response is a failure by inspecting the error field.
 *
 * @param response - Better Fetch response union type
 * @returns {boolean} True if response is a failure
 */
export const isFetchFailure = <TData, TError>(
	response: FetchResponse<TData, TError>
): response is FetchFailure<TError> => response.error !== null;

/**
 * Unwraps Better Fetch response union into Effect error channel.
 *
 * @pure
 * @fp-pattern Response union discrimination with Effect error channel
 *
 * @param response - Better Fetch response union
 * @param createError - Factory function to create typed error from failure payload
 * @returns {Effect.Effect<TData, TError>}
 *
 * @example
 * ```typescript
 * const unwrapped = unwrapFetchResponse(
 *   response,
 *   (error) => new EmailAuthApiError('Sign in failed', error.status, error)
 * );
 * ```
 */
export const unwrapFetchResponse =
	<TError>(createError: (error: TError) => EmailAuthError) =>
	<TData>(response: FetchResponse<TData, TError>): Effect.Effect<TData, EmailAuthError> =>
		isFetchFailure(response) ? Effect.fail(createError(response.error)) : Effect.succeed(response.data);

/**
 * Creates EmailAuthApiError from sign-in error payload.
 *
 * @pure
 * @description Factory function for creating typed API errors with status codes.
 *
 * @param error - Better Auth sign-in error payload
 * @returns {EmailAuthApiError}
 */
export const createSignInApiError = (error: SignInErrorPayload): EmailAuthApiError =>
	new EmailAuthApiError('Sign in failed', error.status, error);

// ============================================================================
// Layer 4: Payload Extraction
// ============================================================================

/**
 * Extracts user payload from sign-in success response.
 *
 * @pure
 * @fp-pattern Required field extraction with Effect error channel
 *
 * @param data - Sign-in success payload
 * @returns {Effect.Effect<AuthClientSessionUserOf<TAuthClient>, EmailAuthDataMissingError>}
 *
 * @example
 * ```typescript
 * const program = pipe(
 *   unwrappedResponse,
 *   Effect.flatMap(extractUserPayload)
 * );
 * ```
 */
export const extractUserPayload = <TAuthClient extends AuthClient>(
	data: SignInSuccessPayload<TAuthClient>
): Effect.Effect<AuthClientSessionUserOf<TAuthClient>, EmailAuthDataMissingError> =>
	data.user
		? Effect.succeed(data.user)
		: Effect.fail(new EmailAuthDataMissingError('Sign in response is missing user payload'));

/**
 * Extracts and validates session from sign-in success response.
 *
 * @pure
 * @fp-pattern Required field extraction with Effect error channel
 *
 * @description Sign-in ALWAYS returns a session (unlike sign-up which may return null).
 * This function validates that the session is present and fails if missing.
 *
 * @param data - Sign-in success payload
 * @returns {Effect.Effect<AuthClientSessionUserSessionOf<TAuthClient>, EmailAuthSessionError>}
 *
 * @example
 * ```typescript
 * const program = pipe(
 *   unwrappedResponse,
 *   Effect.flatMap(requireSession)
 * );
 * ```
 */
export const requireSession = <TAuthClient extends AuthClient>(
	data: SignInSuccessPayload<TAuthClient>
): Effect.Effect<AuthClientSessionUserSessionOf<TAuthClient>, EmailAuthSessionError> =>
	data.session
		? Effect.succeed(data.session)
		: Effect.fail(new EmailAuthSessionError('Sign in response is missing session'));

/**
 * Extracts email verification requirement flag from sign-in response.
 *
 * @pure
 * @description Returns true if email verification is required, false otherwise.
 * Defaults to false if the flag is not present in the response.
 *
 * @param data - Sign-in success payload
 * @returns {boolean} True if email verification required
 *
 * @example
 * ```typescript
 * const requiresVerification = extractRequiresVerification(signInData);
 * // => true or false
 * ```
 */
export const extractRequiresVerification = <TAuthClient extends AuthClient>(
	data: SignInSuccessPayload<TAuthClient>
): boolean => data.requiresVerification ?? false;

// ============================================================================
// Layer 5: Logging & Telemetry
// ============================================================================

/**
 * Logs validation failure.
 *
 * @description Fire-and-forget side effect for logging validation errors.
 *
 * @param logger - Optional logger instance
 * @param error - Validation error
 */
export const logValidationFailure = (
	logger: EmailAuthClientDeps['logger'],
	error: EmailAuthDependenciesError | EmailAuthInputError
): void => {
	logger?.error('signInEmail validation failed', { error });
};

/**
 * Logs and tracks API failure.
 *
 * @description Fire-and-forget side effects for logging and telemetry on API errors.
 *
 * @param logger - Optional logger instance
 * @param telemetry - Optional telemetry instance
 * @param featureFlags - Optional feature flags for context
 * @param error - API error with status
 */
export const logApiFailure = (
	logger: EmailAuthClientDeps['logger'],
	telemetry: EmailAuthClientDeps['telemetry'],
	featureFlags: EmailAuthClientDeps['featureFlags'],
	error: EmailAuthApiError
): void => {
	logger?.error('signInEmail failed', { error });
	void telemetry?.trackEvent('signInEmail.failed', {
		errorStatus: error.status,
		errorMessage: error.message,
		featureFlags,
	});
};

/**
 * Logs and tracks data missing error.
 *
 * @description Fire-and-forget side effects for logging and telemetry on missing data.
 *
 * @param logger - Optional logger instance
 * @param telemetry - Optional telemetry instance
 * @param featureFlags - Optional feature flags for context
 * @param error - Data missing error
 */
export const logDataMissingFailure = (
	logger: EmailAuthClientDeps['logger'],
	telemetry: EmailAuthClientDeps['telemetry'],
	featureFlags: EmailAuthClientDeps['featureFlags'],
	error: EmailAuthDataMissingError
): void => {
	logger?.error('signInEmail failed', { error });
	void telemetry?.trackEvent('signInEmail.failed', {
		errorMessage: error.message,
		featureFlags,
	});
};

/**
 * Logs and tracks session missing error.
 *
 * @description Fire-and-forget side effects for logging and telemetry on session errors.
 *
 * @param logger - Optional logger instance
 * @param telemetry - Optional telemetry instance
 * @param featureFlags - Optional feature flags for context
 * @param error - Session missing error
 */
export const logSignInSessionFailure = (
	logger: EmailAuthClientDeps['logger'],
	telemetry: EmailAuthClientDeps['telemetry'],
	featureFlags: EmailAuthClientDeps['featureFlags'],
	error: EmailAuthSessionError
): void => {
	logger?.error('signInEmail failed', { error });
	void telemetry?.trackEvent('signInEmail.failed', {
		errorMessage: error.message,
		featureFlags,
	});
};

/**
 * Logs and tracks successful sign-in.
 *
 * @description Fire-and-forget side effects for logging and telemetry on success.
 * Includes requiresVerification flag to track verification state.
 *
 * @param logger - Optional logger instance
 * @param telemetry - Optional telemetry instance
 * @param featureFlags - Optional feature flags for context
 * @param userId - Authenticated user ID
 * @param sessionId - Authenticated session ID
 * @param requiresVerification - Whether email verification is required
 */
export const logSignInSuccess = (
	logger: EmailAuthClientDeps['logger'],
	telemetry: EmailAuthClientDeps['telemetry'],
	featureFlags: EmailAuthClientDeps['featureFlags'],
	userId: string,
	sessionId: string,
	requiresVerification: boolean
): void => {
	logger?.info('signInEmail succeeded', { userId, sessionId, requiresVerification });
	void telemetry?.trackEvent('signInEmail.success', {
		userId,
		requiresVerification,
		featureFlags,
	});
};

// ============================================================================
// Layer 6: Result Builder
// ============================================================================

/**
 * Builds successful sign-in result.
 *
 * @pure
 * @description Constructs the final result object from validated user, session, and verification flag.
 *
 * @param user - Authenticated user payload
 * @param session - Authenticated session
 * @param requiresVerification - Whether email verification is required
 * @returns {SignInEmailResult<TAuthClient>}
 *
 * @example
 * ```typescript
 * const result = buildSignInResult(user, session, false);
 * // => { user, session, requiresVerification: false }
 * ```
 */
export const buildSignInResult = <TAuthClient extends AuthClient>(
	user: AuthClientSessionUserOf<TAuthClient>,
	session: AuthClientSessionUserSessionOf<TAuthClient>,
	requiresVerification: boolean
): SignInEmailResult<TAuthClient> => ({
	user,
	session,
	requiresVerification,
});

// ============================================================================
// Layer 7: Composed Pipeline
// ============================================================================

/**
 * Signs in an existing user via email authentication.
 *
 * @description Validates dependencies and input, calls Better Auth sign-in API,
 * and returns the authenticated user with session. Sign-in always returns a session
 * (no fallback needed unlike sign-up). Includes `requiresVerification` flag to indicate
 * if email verification is needed.
 *
 * Composed from 15 pure, testable functions following Single Responsibility Principle.
 *
 * @fp-pattern Curried dependency injection with Effect-based error handling
 * @composition pipe with Effect.flatMap orchestration across 7 functional layers:
 *   1. Validation: validateDeps, validateSignInInput
 *   2. API call: callSignInApi
 *   3. Response unwrapping: unwrapFetchResponse, createSignInApiError
 *   4. Payload extraction: extractUserPayload, requireSession, extractRequiresVerification
 *   5. Logging: logValidationFailure, logApiFailure, logDataMissingFailure, logSignInSessionFailure, logSignInSuccess
 *   6. Result builder: buildSignInResult
 *   7. Pipeline orchestration: Effect.gen with flatMap composition
 *
 * @param deps - Email auth client dependencies (auth client, logger, telemetry)
 * @returns {Effect.Effect<SignInEmailResult, EmailAuthError>} Effect that resolves
 * with authenticated user/session or fails with typed error.
 *
 * @example
 * ```typescript
 * const program = signInEmail(deps)({ email: 'user@example.com', password: 'secret' });
 * const result = await Effect.runPromise(program);
 * // => { user: {...}, session: {...}, requiresVerification: false }
 * ```
 */
export const signInEmail: signInEmailProps<AuthClient> = (deps) => (input) =>
	Effect.gen(function* () {
		// Layer 1: Validate dependencies
		const validatedDeps = yield* pipe(
			validateDeps<AuthClient>(deps),
			Effect.tapError((error) => Effect.sync(() => logValidationFailure(deps.logger, error)))
		);

		// Layer 1: Validate input
		const validatedInput = yield* pipe(
			validateSignInInput(input),
			Effect.tapError((error) => Effect.sync(() => logValidationFailure(validatedDeps.logger, error)))
		);

		const { authClient, logger, telemetry, featureFlags } = validatedDeps;

		// Layer 2: Call sign-in API
		const signInResponse = yield* callSignInApi(authClient)(validatedInput);

		// Layer 3: Unwrap Better Fetch response
		const signInData = yield* pipe(
			unwrapFetchResponse(createSignInApiError)(signInResponse),
			Effect.tapError((error) =>
				Effect.sync(() => logApiFailure(logger, telemetry, featureFlags, error as EmailAuthApiError))
			)
		);

		// Layer 4: Extract user payload
		const user = yield* pipe(
			extractUserPayload<AuthClient>(signInData),
			Effect.tapError((error) =>
				Effect.sync(() => logDataMissingFailure(logger, telemetry, featureFlags, error))
			)
		);

		// Layer 4: Extract session (always present for sign-in)
		const session = yield* pipe(
			requireSession<AuthClient>(signInData),
			Effect.tapError((error) =>
				Effect.sync(() => logSignInSessionFailure(logger, telemetry, featureFlags, error))
			)
		);

		// Layer 4: Extract verification flag
		const requiresVerification = extractRequiresVerification<AuthClient>(signInData);

		// Layer 5: Log success
		logSignInSuccess(logger, telemetry, featureFlags, user.id, session.id, requiresVerification);

		// Layer 6: Build result
		return buildSignInResult<AuthClient>(user, session, requiresVerification);
	});
