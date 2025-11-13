/**
 * Mock implementations for validation utilities.
 *
 * @description This module provides mock implementations of validation utilities
 * for testing email authentication operations without requiring real Better Auth
 * dependencies. Includes mock validators, fixtures for valid/invalid dependencies,
 * and test data structures.
 */

import { Effect } from 'effect';
import { vi } from 'vitest';
import type { EmailAuthClientDeps } from '../email.types.js';
import { EmailAuthDependenciesError } from '../email.error.js';
import { isEmailAuthClientDeps } from './validation.js';

/**
 * Mock implementation of createValidator.
 *
 * @pure
 * @description Creates a mock validator function that uses a type guard to validate
 * input and returns an Effect with typed error channel. Mimics the real implementation
 * behavior exactly.
 *
 * @template TInput - The type of the validated input
 * @template TError - The type of the error (extends Error)
 *
 * @param guard - Type guard function to validate input
 * @param errorFactory - Factory to create error from message
 * @param errorMessage - Error message when validation fails
 * @returns {(input: unknown) => Effect.Effect<TInput, TError>}
 *   Mock validator function that returns Effect with validated input or error
 *
 * @example
 * ```typescript
 * const validateEmail = mockCreateValidator(
 *   (input): input is string => typeof input === 'string' && input.includes('@'),
 *   (msg) => new EmailAuthInputError(msg),
 *   'Invalid email address'
 * );
 *
 * const effect1 = validateEmail('user@example.com');
 * // => Effect.succeed('user@example.com')
 *
 * const effect2 = validateEmail('invalid');
 * // => Effect.fail(new EmailAuthInputError('Invalid email address'))
 * ```
 */
export const mockCreateValidator =
	<TInput, TError extends Error>(guard: (input: unknown) => input is TInput, errorFactory: (message: string) => TError, errorMessage: string) =>
	(input: unknown): Effect.Effect<TInput, TError> =>
		guard(input) ? Effect.succeed(input) : Effect.fail(errorFactory(errorMessage));

/**
 * Mock implementation of createValidateDeps.
 *
 * @pure
 * @description Creates a mock validator for EmailAuthClientDeps with operation-specific
 * error messages. Mimics the real implementation behavior exactly.
 *
 * @template TAuthClient - The type of the auth client (extends AuthClient)
 *
 * @param operationName - Human-readable operation name (e.g., 'signUpEmail', 'signInEmail')
 * @returns {(deps: unknown) => Effect.Effect<EmailAuthClientDeps<TAuthClient>, EmailAuthDependenciesError>}
 *   Mock validator function that validates dependencies
 *
 * @example
 * ```typescript
 * const validateDeps = mockCreateValidateDeps<AuthClient>('signUpEmail');
 *
 * const effect1 = validateDeps(mockValidDeps);
 * // => Effect.succeed(mockValidDeps)
 *
 * const effect2 = validateDeps({ authClient: null });
 * // => Effect.fail(new EmailAuthDependenciesError('Invalid dependencies provided to signUpEmail'))
 * ```
 */
export const mockCreateValidateDeps = <TAuthClient = any>(operationName: string) =>
	mockCreateValidator<EmailAuthClientDeps<any>, EmailAuthDependenciesError>(
		isEmailAuthClientDeps as any,
		(msg) => new EmailAuthDependenciesError(msg),
		`Invalid dependencies provided to ${operationName}`
	);

/**
 * Mock AuthClient fixture with Vitest spy functions.
 *
 * @description Provides a mock AuthClient with all methods stubbed using vi.fn().
 * Each method returns a promise resolving to a minimal success response by default.
 * Methods can be individually mocked using .mockResolvedValue() or .mockRejectedValue().
 *
 * @example
 * ```typescript
 * const authClient = mockAuthClient();
 * authClient.signUp.email = vi.fn().mockResolvedValue({
 *   data: { user: { id: 'user-123', email: 'test@example.com' }, session: null },
 *   error: null
 * });
 * ```
 */
export const mockAuthClient = () =>
	({
		signUp: {
			email: vi.fn().mockResolvedValue({ data: null, error: null }),
		},
		signIn: {
			email: vi.fn().mockResolvedValue({ data: null, error: null }),
		},
		signOut: vi.fn().mockResolvedValue({ data: null, error: null }),
		getSession: vi.fn().mockResolvedValue({ data: null, error: null }),
	}) as unknown;

/**
 * Mock Logger fixture with Vitest spy functions.
 *
 * @description Provides a mock logger with all log level methods stubbed using vi.fn().
 * Each method is a no-op by default and can be used to verify logging behavior.
 *
 * @example
 * ```typescript
 * const logger = mockLogger();
 * logger.info('Test message', { userId: '123' });
 * expect(logger.info).toHaveBeenCalledWith('Test message', expect.objectContaining({ userId: '123' }));
 * ```
 */
export const mockLogger = () => ({
	debug: vi.fn(),
	info: vi.fn(),
	warn: vi.fn(),
	error: vi.fn(),
});

/**
 * Mock Telemetry fixture with Vitest spy functions.
 *
 * @description Provides a mock telemetry service with trackEvent stubbed using vi.fn().
 * The method is a no-op by default and can be used to verify telemetry tracking.
 *
 * @example
 * ```typescript
 * const telemetry = mockTelemetry();
 * telemetry.trackEvent('auth.signUp.success', { userId: '123' });
 * expect(telemetry.trackEvent).toHaveBeenCalledWith('auth.signUp.success', expect.any(Object));
 * ```
 */
export const mockTelemetry = () => ({
	trackEvent: vi.fn(),
});

/**
 * Mock FeatureFlags fixture.
 *
 * @description Provides a mock feature flags object with common email auth flags enabled.
 * Can be modified per test case as needed.
 *
 * @example
 * ```typescript
 * const featureFlags = mockFeatureFlags();
 * expect(featureFlags.emailAuthEnabled).toBe(true);
 * ```
 */
export const mockFeatureFlags = () => ({
	emailAuthEnabled: true,
	telemetryEnabled: true,
	sessionFallbackEnabled: true,
});

/**
 * Complete valid EmailAuthClientDeps fixture.
 *
 * @description Provides a fully configured EmailAuthClientDeps object with all
 * mock dependencies. This is the primary fixture for testing email auth operations.
 *
 * @template TAuthClient - The type of the auth client (defaults to AuthClient)
 *
 * @example
 * ```typescript
 * const deps = mockValidDeps<AuthClient>();
 * const validateDeps = mockCreateValidateDeps<AuthClient>('signUpEmail');
 * const result = await Effect.runPromise(validateDeps(deps));
 * expect(result).toBe(deps);
 * ```
 */
export const mockValidDeps = <TAuthClient = any>(): any =>
	({
		authClient: mockAuthClient() as TAuthClient,
		logger: mockLogger(),
		telemetry: mockTelemetry(),
		featureFlags: mockFeatureFlags(),
	}) as any;

/**
 * Invalid EmailAuthClientDeps fixture - missing authClient.
 *
 * @description Provides an invalid deps object where authClient is null.
 * Used to test validation error paths.
 *
 * @example
 * ```typescript
 * const invalidDeps = mockInvalidDeps_MissingAuthClient();
 * const validateDeps = mockCreateValidateDeps<AuthClient>('signUpEmail');
 * const result = Effect.runPromise(validateDeps(invalidDeps));
 * // Throws EmailAuthDependenciesError
 * ```
 */
export const mockInvalidDeps_MissingAuthClient = () => ({
	authClient: null,
	logger: mockLogger(),
	telemetry: mockTelemetry(),
	featureFlags: mockFeatureFlags(),
});

/**
 * Invalid EmailAuthClientDeps fixture - wrong authClient type.
 *
 * @description Provides an invalid deps object where authClient is a plain object
 * instead of an AuthClient instance. Used to test type validation error paths.
 *
 * @example
 * ```typescript
 * const invalidDeps = mockInvalidDeps_WrongAuthClientType();
 * const validateDeps = mockCreateValidateDeps<AuthClient>('signInEmail');
 * const result = Effect.runPromise(validateDeps(invalidDeps));
 * // Throws EmailAuthDependenciesError
 * ```
 */
export const mockInvalidDeps_WrongAuthClientType = () => ({
	authClient: { someWrongProperty: 'value' },
	logger: mockLogger(),
	telemetry: mockTelemetry(),
	featureFlags: mockFeatureFlags(),
});

/**
 * Valid signUpEmail input fixture.
 *
 * @description Provides valid input data for signUpEmail operation testing.
 *
 * @example
 * ```typescript
 * const input = mockSignUpInput();
 * expect(input.email).toBe('test@example.com');
 * ```
 */
export const mockSignUpInput = () => ({
	email: 'test@example.com',
	password: 'SecurePass123!',
	name: 'Test User',
});

/**
 * Valid signInEmail input fixture.
 *
 * @description Provides valid input data for signInEmail operation testing.
 *
 * @example
 * ```typescript
 * const input = mockSignInInput();
 * expect(input.email).toBe('test@example.com');
 * ```
 */
export const mockSignInInput = () => ({
	email: 'test@example.com',
	password: 'SecurePass123!',
});

/**
 * Valid signOut options fixture.
 *
 * @description Provides valid options data for signOut operation testing.
 *
 * @example
 * ```typescript
 * const options = mockSignOutOptions();
 * expect(options.onSuccess).toBeDefined();
 * ```
 */
export const mockSignOutOptions = () => ({
	onSuccess: vi.fn(),
	onError: vi.fn(),
});

/**
 * Invalid signUpEmail input fixture - missing email.
 *
 * @description Provides invalid input where email field is missing.
 * Used to test input validation error paths.
 *
 * @example
 * ```typescript
 * const invalidInput = mockInvalidSignUpInput_MissingEmail();
 * // Should fail validation
 * ```
 */
export const mockInvalidSignUpInput_MissingEmail = () => ({
	email: undefined,
	password: 'SecurePass123!',
	name: 'Test User',
});

/**
 * Invalid signInEmail input fixture - malformed email.
 *
 * @description Provides invalid input where email format is incorrect.
 * Used to test input validation error paths.
 *
 * @example
 * ```typescript
 * const invalidInput = mockInvalidSignInInput_MalformedEmail();
 * // Should fail email format validation
 * ```
 */
export const mockInvalidSignInInput_MalformedEmail = () => ({
	email: 'not-an-email',
	password: 'SecurePass123!',
});

/**
 * Invalid signOut options fixture - non-function callback.
 *
 * @description Provides invalid options where callback is not a function.
 * Used to test options validation error paths.
 *
 * @example
 * ```typescript
 * const invalidOptions = mockInvalidSignOutOptions_NonFunctionCallback();
 * // Should fail callback type validation
 * ```
 */
export const mockInvalidSignOutOptions_NonFunctionCallback = () => ({
	onSuccess: 'not a function',
	onError: vi.fn(),
});
