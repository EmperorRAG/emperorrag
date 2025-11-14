import { Effect, pipe } from 'effect';
import type { SignUpEmailInput, SignUpEmailResult, signUpEmailProps } from '../email.types.js';
import { isSignUpEmailInput } from '../email.types.js';
import { EmailAuthInputError, EmailAuthApiError, EmailAuthDataMissingError, EmailAuthSessionError } from '../email.error.js';
import { type FetchResponse, isFetchFailure, unwrapFetchResponse, createApiErrorFactory, createValidateDeps } from '../shared/index.js';
import type { AuthClient, AuthClientSessionOf, AuthClientSessionUserOf, AuthClientSessionUserSessionOf } from '../../../../client.js';

// ============================================================================
// Type Definitions
// ============================================================================

type SignUpSuccessPayload<TAuthClient extends AuthClient> = Readonly<{
	user: AuthClientSessionUserOf<TAuthClient>;
	session?: AuthClientSessionUserSessionOf<TAuthClient> | null;
	token?: string | null;
}>;

type SignUpErrorPayload = Readonly<{
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
 * @description Factory-generated validator for sign-up operation dependencies.
 * Uses shared validation utility to ensure consistent error handling across operations.
 *
 * @see {@link createValidateDeps} from shared/validation.ts
 */
const validateDeps = createValidateDeps<AuthClient>('signUpEmail');

/**
 * Validates sign-up email input payload.
 *
 * @pure
 * @fp-pattern Higher-order validation with Effect error channel
 *
 * @param input - Input payload to validate
 * @returns {Effect.Effect<SignUpEmailInput, EmailAuthInputError>}
 *
 * @example
 * ```typescript
 * const validated = validateSignUpInput({ email: 'user@example.com', password: 'secret', name: 'User' });
 * // => Effect.succeed(input) or Effect.fail(new EmailAuthInputError(...))
 * ```
 */
export const validateSignUpInput = (input: unknown): Effect.Effect<SignUpEmailInput, EmailAuthInputError> =>
	isSignUpEmailInput(input) ? Effect.succeed(input) : Effect.fail(new EmailAuthInputError('Invalid sign up payload'));

// ============================================================================
// Layer 2: API Calls
// ============================================================================

/**
 * Calls Better Auth sign-up API with provided credentials.
 *
 * @description Wraps the Better Auth client sign-up call in an Effect, converting
 * Promise rejections to typed EmailAuthApiError failures.
 *
 * @param authClient - Better Auth client instance
 * @returns {Function} Curried function accepting sign-up input
 *
 * @example
 * ```typescript
 * const program = pipe(
 *   validateSignUpInput(input),
 *   Effect.flatMap(callSignUpApi(authClient))
 * );
 * ```
 */
export const callSignUpApi =
	<TAuthClient extends AuthClient>(authClient: TAuthClient) =>
	(input: SignUpEmailInput): Effect.Effect<FetchResponse<SignUpSuccessPayload<TAuthClient>, SignUpErrorPayload>, EmailAuthApiError> =>
		Effect.tryPromise({
			try: () =>
				authClient.signUp.email({
					name: input.name,
					email: input.email,
					password: input.password,
					image: input.image,
					callbackURL: input.callbackUrl,
				}) as Promise<FetchResponse<SignUpSuccessPayload<TAuthClient>, SignUpErrorPayload>>,
			catch: (error) => new EmailAuthApiError('Sign up API call failed', undefined, error),
		});

/**
 * Fetches current session from Better Auth client.
 *
 * @description Wraps the Better Auth client session fetch in an Effect, converting
 * Promise rejections to typed EmailAuthSessionError failures.
 *
 * @param authClient - Better Auth client instance
 * @returns {Effect.Effect<FetchResponse<...>, EmailAuthSessionError>}
 *
 * @example
 * ```typescript
 * const program = fetchSession(authClient);
 * ```
 */
export const fetchSession = <TAuthClient extends AuthClient>(
	authClient: TAuthClient
): Effect.Effect<FetchResponse<AuthClientSessionOf<TAuthClient> | null, SignUpErrorPayload>, EmailAuthSessionError> =>
	Effect.tryPromise({
		try: () => authClient.getSession() as Promise<FetchResponse<AuthClientSessionOf<TAuthClient> | null, SignUpErrorPayload>>,
		catch: (error) => new EmailAuthSessionError('Failed to fetch session', error),
	});

// ============================================================================
// Layer 3: Response Unwrapping
// ============================================================================

/**
 * Creates EmailAuthApiError from sign-up error payload.
 *
 * @description Factory-generated error constructor for sign-up operation.
 * Uses shared error factory utility to ensure consistent error handling.
 *
 * @see {@link createApiErrorFactory} from shared/response-unwrapping.ts
 */
const createSignUpApiError = createApiErrorFactory('Sign up');

// ============================================================================
// Layer 4: Payload Extraction
// ============================================================================

/**
 * Extracts user payload from sign-up success response.
 *
 * @pure
 * @fp-pattern Required field extraction with Effect error channel
 *
 * @param data - Sign-up success payload
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
	data: SignUpSuccessPayload<TAuthClient>
): Effect.Effect<AuthClientSessionUserOf<TAuthClient>, EmailAuthDataMissingError> =>
	data.user ? Effect.succeed(data.user) : Effect.fail(new EmailAuthDataMissingError('Sign up response is missing user payload'));

/**
 * Extracts optional session from sign-up success response.
 *
 * @pure
 * @description Returns session if present, otherwise null (no failure).
 *
 * @param data - Sign-up success payload
 * @returns {AuthClientSessionUserSessionOf<TAuthClient> | null}
 */
export const extractSessionFromResponse = <TAuthClient extends AuthClient>(
	data: SignUpSuccessPayload<TAuthClient>
): AuthClientSessionUserSessionOf<TAuthClient> | null => data.session ?? null;

/**
 * Extracts session from successful getSession response.
 *
 * @pure
 * @description Returns session if present in data, otherwise null (no failure).
 *
 * @param data - Get session success payload
 * @returns {AuthClientSessionUserSessionOf<TAuthClient> | null}
 */
export const extractSessionFromFetch = <TAuthClient extends AuthClient>(
	data: AuthClientSessionOf<TAuthClient> | null
): AuthClientSessionUserSessionOf<TAuthClient> | null => {
	if (!data) return null;
	// AuthClientSessionOf has { session: ..., user: ... } structure
	// We need to extract the session property to get AuthClientSessionUserSessionOf
	return (data as { session: AuthClientSessionUserSessionOf<TAuthClient> }).session ?? null;
};

// ============================================================================
// Layer 5: Session Resolution
// ============================================================================

/**
 * Resolves session with fallback logic.
 *
 * @description If initial session is null, attempts to fetch from API. If fetch fails,
 * returns null (graceful degradation). Final validation happens in pipeline.
 *
 * @param authClient - Better Auth client instance
 * @returns {Function} Curried function accepting initial session
 *
 * @example
 * ```typescript
 * const program = pipe(
 *   extractSessionFromResponse(data),
 *   (session) => resolveSession(authClient)(session)
 * );
 * ```
 */
export const resolveSession =
	<TAuthClient extends AuthClient>(authClient: TAuthClient) =>
	(
		initialSession: AuthClientSessionUserSessionOf<TAuthClient> | null
	): Effect.Effect<AuthClientSessionUserSessionOf<TAuthClient> | null, EmailAuthSessionError> =>
		initialSession
			? Effect.succeed(initialSession)
			: pipe(
					fetchSession(authClient),
					Effect.flatMap((sessionResponse) =>
						pipe(
							sessionResponse,
							// Unwrap the Better Fetch response
							(response) => (isFetchFailure(response) ? Effect.succeed(null) : Effect.succeed(response.data)),
							Effect.map(extractSessionFromFetch<TAuthClient>)
						)
					),
					// Catch any errors and return null (graceful degradation)
					Effect.catchAll(() => Effect.succeed(null))
				);

/**
 * Validates that session is non-null after resolution.
 *
 * @pure
 * @fp-pattern Required field validation with Effect error channel
 *
 * @param session - Resolved session (may be null)
 * @returns {Effect.Effect<AuthClientSessionUserSessionOf<TAuthClient>, EmailAuthSessionError>}
 *
 * @example
 * ```typescript
 * const program = pipe(
 *   resolvedSession,
 *   Effect.flatMap(requireSession)
 * );
 * ```
 */
export const requireSession = <TAuthClient extends AuthClient>(
	session: AuthClientSessionUserSessionOf<TAuthClient> | null
): Effect.Effect<AuthClientSessionUserSessionOf<TAuthClient>, EmailAuthSessionError> =>
	session ? Effect.succeed(session) : Effect.fail(new EmailAuthSessionError('Unable to resolve session after sign up'));

// ============================================================================
// Layer 6: Result Builders
// ============================================================================

/**
 * Builds successful sign-up result.
 *
 * @pure
 * @description Constructs the final result object from validated user, session, and input.
 *
 * @param user - Authenticated user payload
 * @param session - Authenticated session
 * @param callbackUrl - Optional callback URL from input
 * @returns {SignUpEmailResult<TAuthClient>}
 *
 * @example
 * ```typescript
 * const result = buildSignUpResult(user, session, input.callbackUrl);
 * ```
 */
export const buildSignUpResult = <TAuthClient extends AuthClient>(
	user: AuthClientSessionUserOf<TAuthClient>,
	session: AuthClientSessionUserSessionOf<TAuthClient>,
	callbackUrl?: string
): SignUpEmailResult<TAuthClient> => ({
	user,
	session,
	callbackUrl,
});

// ============================================================================
// Layer 7: Composed Pipeline
// ============================================================================

/**
 * Signs up a new user via email authentication.
 *
 * @description Validates dependencies and input, calls Better Auth sign-up API,
 * resolves session with fallback, and returns the authenticated user with session.
 * Composed from pure, testable functions following Single Responsibility Principle.
 *
 * @fp-pattern Curried dependency injection with Effect-based error handling
 * @composition pipe with Effect.flatMap orchestration across 7 functional layers:
 *   1. Validation: validateDeps, validateSignUpInput
 *   2. API calls: callSignUpApi, fetchSession
 *   3. Response unwrapping: unwrapFetchResponse, createSignUpApiError
 *   4. Payload extraction: extractUserPayload, extractSessionFromResponse
 *   5. Session resolution: resolveSession, requireSession
 *   6. Result builders: buildSignUpResult
 *   7. Pipeline orchestration: Effect.gen with flatMap composition
 *
 * @param deps - Email auth client dependencies (auth client)
 * @returns {Effect.Effect<SignUpEmailResult, EmailAuthError>} Effect that resolves
 * with authenticated user/session or fails with typed error.
 *
 * @example
 * ```typescript
 * const program = signUpEmail(deps)({ email: 'user@example.com', password: 'secret', name: 'User' });
 * const result = await Effect.runPromise(program);
 * ```
 */
export const signUpEmail: signUpEmailProps<AuthClient> = (deps) => (input) =>
	Effect.gen(function* () {
		// Layer 1: Validate dependencies
		const validatedDeps = yield* validateDeps(deps);

		// Layer 1: Validate input
		const validatedInput = yield* validateSignUpInput(input);

		const { authClient } = validatedDeps;

		// Layer 2: Call sign-up API
		const signUpResponse = yield* callSignUpApi(authClient)(validatedInput);

		// Layer 3: Unwrap Better Fetch response
		const signUpData = yield* unwrapFetchResponse(createSignUpApiError)(signUpResponse);

		// Layer 4: Extract user payload
		const user = yield* extractUserPayload<AuthClient>(signUpData);

		// Layer 4 & 5: Extract and resolve session
		const initialSession = extractSessionFromResponse<AuthClient>(signUpData);
		const resolvedSession = yield* resolveSession(authClient)(initialSession);

		// Layer 5: Require session (final validation)
		const session = yield* requireSession<AuthClient>(resolvedSession);

		// Layer 6: Build result
		return buildSignUpResult<AuthClient>(user, session, validatedInput.callbackUrl);
	});
