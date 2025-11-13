import { Effect, pipe } from 'effect';
import type {
	SignInEmailInput,
	SignInEmailResult,
	signInEmailProps,
} from '../email.types.js';
import { isSignInEmailInput } from '../email.types.js';
import {
	EmailAuthInputError,
	EmailAuthApiError,
	EmailAuthDataMissingError,
	EmailAuthSessionError,
} from '../email.error.js';
import {
	type FetchResponse,
	unwrapFetchResponse,
	createApiErrorFactory,
	createValidateDeps,
	createLogValidationFailure,
	createLogApiFailure,
	createLogDataMissingFailure,
	createLogSessionFailure,
	createLogSuccess,
} from '../shared/index.js';
import type {
	AuthClient,
	AuthClientSessionUserOf,
	AuthClientSessionUserSessionOf,
} from '../../../../client.js';

// ============================================================================
// Type Definitions
// ============================================================================

type SignInSuccessPayload<TAuthClient extends AuthClient> = Readonly<{
	user: AuthClientSessionUserOf<TAuthClient>;
	session: AuthClientSessionUserSessionOf<TAuthClient>; // Always present for sign-in
	requiresVerification?: boolean; // Optional verification flag
}>;

type SignInErrorPayload = Readonly<{
	status?: number;
	message?: string;
}> & Readonly<Record<string, unknown>>;

// ============================================================================
// Layer 1: Validation
// ============================================================================

/**
 * Validates email auth client dependencies.
 *
 * @description Factory-generated validator for sign-in operation dependencies.
 * Uses shared validation utility to ensure consistent error handling across operations.
 *
 * @see {@link createValidateDeps} from shared/validation.ts
 */
const validateDeps = createValidateDeps<AuthClient>('signInEmail');

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
 * Creates EmailAuthApiError from sign-in error payload.
 *
 * @description Factory-generated error constructor for sign-in operation.
 * Uses shared error factory utility to ensure consistent error handling.
 *
 * @see {@link createApiErrorFactory} from shared/response-unwrapping.ts
 */
const createSignInApiError = createApiErrorFactory('Sign in');

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
 * @description Factory-generated logger for sign-in validation failures.
 * Uses shared logging utility to ensure consistent logging across operations.
 *
 * @see {@link createLogValidationFailure} from shared/logging.ts
 */
const logValidationFailure = createLogValidationFailure('Sign in');

/**
 * Logs and tracks API failure.
 *
 * @description Factory-generated logger for sign-in API failures.
 * Uses shared logging utility to ensure consistent logging and telemetry.
 *
 * @see {@link createLogApiFailure} from shared/logging.ts
 */
const logApiFailure = createLogApiFailure('Sign in');

/**
 * Logs and tracks data missing error.
 *
 * @description Factory-generated logger for sign-in data missing failures.
 * Uses shared logging utility to ensure consistent logging and telemetry.
 *
 * @see {@link createLogDataMissingFailure} from shared/logging.ts
 */
const logDataMissingFailure = createLogDataMissingFailure('Sign in');

/**
 * Logs and tracks session missing error.
 *
 * @description Factory-generated logger for sign-in session failures.
 * Uses shared logging utility to ensure consistent logging and telemetry.
 *
 * @see {@link createLogSessionFailure} from shared/logging.ts
 */
const logSignInSessionFailure = createLogSessionFailure('Sign in');

/**
 * Logs and tracks successful sign-in.
 *
 * @description Factory-generated logger for sign-in success.
 * Uses shared logging utility to ensure consistent logging and telemetry.
 *
 * @see {@link createLogSuccess} from shared/logging.ts
 */
const logSignInSuccess = createLogSuccess('Sign in');

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
			validateDeps(deps),
			Effect.tapError((error) => logValidationFailure(deps.logger, error))
		);

		// Layer 1: Validate input
		const validatedInput = yield* pipe(
			validateSignInInput(input),
			Effect.tapError((error) => logValidationFailure(validatedDeps.logger, error))
		);

		const { authClient, logger, telemetry, featureFlags } = validatedDeps;

		// Layer 2: Call sign-in API
		const signInResponse = yield* callSignInApi(authClient)(validatedInput);

		// Layer 3: Unwrap Better Fetch response
		const signInData = yield* pipe(
			unwrapFetchResponse(createSignInApiError)(signInResponse),
			Effect.tapError((error) => logApiFailure(logger, telemetry, featureFlags, error as EmailAuthApiError))
		);

		// Layer 4: Extract user payload
		const user = yield* pipe(
			extractUserPayload<AuthClient>(signInData),
			Effect.tapError((error) => logDataMissingFailure(logger, telemetry, featureFlags, error))
		);

		// Layer 4: Extract session (always present for sign-in)
		const session = yield* pipe(
			requireSession<AuthClient>(signInData),
			Effect.tapError((error) => logSignInSessionFailure(logger, telemetry, featureFlags, error))
		);

		// Layer 4: Extract verification flag
		const requiresVerification = extractRequiresVerification<AuthClient>(signInData);

		// Layer 5: Log success
		yield* logSignInSuccess(logger, telemetry, featureFlags, {
			userId: user.id,
			sessionId: session.id,
			requiresVerification,
		});

		// Layer 6: Build result
		return buildSignInResult<AuthClient>(user, session, requiresVerification);
	});
