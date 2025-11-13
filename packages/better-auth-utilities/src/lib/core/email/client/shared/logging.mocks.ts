/**
 * Mock implementations for logging utilities.
 *
 * @description This module provides mock implementations of logging utilities
 * for testing email authentication operations. Includes mock logging factories,
 * spy-enabled logger/telemetry fixtures, verification utilities, and error fixtures.
 */

import { Effect } from 'effect';
import { vi } from 'vitest';
import type { Mock } from 'vitest';
import type { EmailAuthClientDeps } from '../email.types.js';
import { EmailAuthDependenciesError, EmailAuthInputError, EmailAuthApiError, EmailAuthDataMissingError, EmailAuthSessionError } from '../email.error.js';

/**
 * Mock logger with Vitest spy functions.
 *
 * @description Logger fixture where all methods are Vitest spy functions.
 * Enables verification of logging calls during tests.
 *
 * @example
 * ```typescript
 * const logger = mockLoggerWithSpies();
 * logger.info('Test message', { userId: '123' });
 * expect(logger.info).toHaveBeenCalledWith('Test message', expect.objectContaining({ userId: '123' }));
 * ```
 */
export const mockLoggerWithSpies = () => ({
	debug: vi.fn() as Mock,
	info: vi.fn() as Mock,
	warn: vi.fn() as Mock,
	error: vi.fn() as Mock,
});

/**
 * Mock telemetry with Vitest spy functions.
 *
 * @description Telemetry fixture where trackEvent is a Vitest spy function.
 * Enables verification of telemetry tracking during tests.
 *
 * @example
 * ```typescript
 * const telemetry = mockTelemetryWithSpies();
 * telemetry.trackEvent('auth.signUp.success', { userId: '123' });
 * expect(telemetry.trackEvent).toHaveBeenCalledWith('auth.signUp.success', expect.any(Object));
 * ```
 */
export const mockTelemetryWithSpies = () => ({
	trackEvent: vi.fn() as Mock,
});

/**
 * Mock implementation of createLogValidationFailure.
 *
 * @description Creates a mock validation failure logger for a specific operation.
 * Returns an Effect-wrapped logger that logs validation errors with operation context.
 *
 * @param operation - Human-readable operation name (e.g., 'Sign in', 'Sign out')
 * @returns {(logger, error) => Effect.Effect<void, never>}
 *   Mock Effect-wrapped logger function that never fails
 *
 * @example
 * ```typescript
 * const logValidationFailure = mockCreateLogValidationFailure('Sign up');
 * const logger = mockLoggerWithSpies();
 * const error = new EmailAuthInputError('Invalid email');
 * const effect = logValidationFailure(logger, error);
 * await Effect.runPromise(effect);
 * expect(logger.error).toHaveBeenCalledWith('Sign up validation failed', expect.objectContaining({ error: 'Invalid email' }));
 * ```
 */
export const mockCreateLogValidationFailure =
	(operation: string) =>
	(logger: EmailAuthClientDeps['logger'], error: EmailAuthDependenciesError | EmailAuthInputError): Effect.Effect<void, never> =>
		Effect.sync(() => {
			logger?.error?.(`${operation} validation failed`, {
				error: error.message,
				errorType: error._tag,
			});
		});

/**
 * Mock implementation of createLogApiFailure.
 *
 * @description Creates a mock API failure logger for a specific operation.
 * Returns an Effect-wrapped logger that logs API errors with telemetry tracking.
 *
 * @param operation - Human-readable operation name (e.g., 'Sign in', 'Sign out')
 * @returns {(logger, telemetry, featureFlags, error) => Effect.Effect<void, never>}
 *   Mock Effect-wrapped logger function that never fails
 *
 * @example
 * ```typescript
 * const logApiFailure = mockCreateLogApiFailure('Sign in');
 * const logger = mockLoggerWithSpies();
 * const telemetry = mockTelemetryWithSpies();
 * const featureFlags = { telemetryEnabled: true };
 * const error = new EmailAuthApiError('API failed', 401);
 * const effect = logApiFailure(logger, telemetry, featureFlags, error);
 * await Effect.runPromise(effect);
 * expect(logger.error).toHaveBeenCalled();
 * expect(telemetry.trackEvent).toHaveBeenCalledWith('auth.signin.failure', expect.any(Object));
 * ```
 */
export const mockCreateLogApiFailure =
	(operation: string) =>
	(
		logger: EmailAuthClientDeps['logger'],
		telemetry: EmailAuthClientDeps['telemetry'],
		featureFlags: EmailAuthClientDeps['featureFlags'],
		error: EmailAuthApiError
	): Effect.Effect<void, never> =>
		Effect.sync(() => {
			logger?.error?.(`${operation} API call failed`, {
				error: error.message,
				status: error.status,
			});

			if (featureFlags?.telemetryEnabled && telemetry?.trackEvent) {
				const sanitizedOperation = operation.toLowerCase().replace(/\s+/g, '');
				telemetry.trackEvent(`auth.${sanitizedOperation}.failure`, {
					error: error.message,
					status: error.status,
				});
			}
		});

/**
 * Mock implementation of createLogDataMissingFailure.
 *
 * @description Creates a mock data missing failure logger for a specific operation.
 * Returns an Effect-wrapped logger that logs data missing errors with telemetry.
 *
 * @param operation - Human-readable operation name (e.g., 'Sign up', 'Sign in')
 * @returns {(logger, telemetry, featureFlags, error) => Effect.Effect<void, never>}
 *   Mock Effect-wrapped logger function that never fails
 *
 * @example
 * ```typescript
 * const logDataMissing = mockCreateLogDataMissingFailure('Sign up');
 * const logger = mockLoggerWithSpies();
 * const error = new EmailAuthDataMissingError('User data missing');
 * const effect = logDataMissing(logger, telemetry, featureFlags, error);
 * await Effect.runPromise(effect);
 * expect(logger.error).toHaveBeenCalled();
 * ```
 */
export const mockCreateLogDataMissingFailure =
	(operation: string) =>
	(
		logger: EmailAuthClientDeps['logger'],
		telemetry: EmailAuthClientDeps['telemetry'],
		featureFlags: EmailAuthClientDeps['featureFlags'],
		error: EmailAuthDataMissingError
	): Effect.Effect<void, never> =>
		Effect.sync(() => {
			logger?.error?.(`${operation} data missing`, {
				error: error.message,
			});

			if (featureFlags?.telemetryEnabled && telemetry?.trackEvent) {
				const sanitizedOperation = operation.toLowerCase().replace(/\s+/g, '');
				telemetry.trackEvent(`auth.${sanitizedOperation}.dataMissing`, {
					error: error.message,
				});
			}
		});

/**
 * Mock implementation of createLogSessionFailure.
 *
 * @description Creates a mock session failure logger for a specific operation.
 * Returns an Effect-wrapped logger that logs session errors with telemetry.
 *
 * @param operation - Human-readable operation name (e.g., 'Sign up', 'Sign in')
 * @returns {(logger, telemetry, featureFlags, error) => Effect.Effect<void, never>}
 *   Mock Effect-wrapped logger function that never fails
 *
 * @example
 * ```typescript
 * const logSessionFailure = mockCreateLogSessionFailure('Sign in');
 * const logger = mockLoggerWithSpies();
 * const error = new EmailAuthSessionError('Session not found');
 * const effect = logSessionFailure(logger, telemetry, featureFlags, error);
 * await Effect.runPromise(effect);
 * expect(logger.error).toHaveBeenCalled();
 * ```
 */
export const mockCreateLogSessionFailure =
	(operation: string) =>
	(
		logger: EmailAuthClientDeps['logger'],
		telemetry: EmailAuthClientDeps['telemetry'],
		featureFlags: EmailAuthClientDeps['featureFlags'],
		error: EmailAuthSessionError
	): Effect.Effect<void, never> =>
		Effect.sync(() => {
			logger?.error?.(`${operation} session error`, {
				error: error.message,
			});

			if (featureFlags?.telemetryEnabled && telemetry?.trackEvent) {
				const sanitizedOperation = operation.toLowerCase().replace(/\s+/g, '');
				telemetry.trackEvent(`auth.${sanitizedOperation}.sessionFailure`, {
					error: error.message,
				});
			}
		});

/**
 * Mock implementation of createLogSuccess.
 *
 * @description Creates a mock success logger for a specific operation.
 * Returns an Effect-wrapped logger that logs success with telemetry tracking.
 *
 * @param operation - Human-readable operation name (e.g., 'Sign up', 'Sign in')
 * @returns {(logger, telemetry, featureFlags, metadata) => Effect.Effect<void, never>}
 *   Mock Effect-wrapped logger function that never fails
 *
 * @example
 * ```typescript
 * const logSuccess = mockCreateLogSuccess('Sign up');
 * const logger = mockLoggerWithSpies();
 * const telemetry = mockTelemetryWithSpies();
 * const featureFlags = { telemetryEnabled: true };
 * const metadata = { userId: 'user-123', email: 'test@example.com' };
 * const effect = logSuccess(logger, telemetry, featureFlags, metadata);
 * await Effect.runPromise(effect);
 * expect(logger.info).toHaveBeenCalledWith('Sign up completed successfully', expect.any(Object));
 * expect(telemetry.trackEvent).toHaveBeenCalledWith('auth.signup.success', expect.any(Object));
 * ```
 */
export const mockCreateLogSuccess =
	(operation: string) =>
	(
		logger: EmailAuthClientDeps['logger'],
		telemetry: EmailAuthClientDeps['telemetry'],
		featureFlags: EmailAuthClientDeps['featureFlags'],
		metadata: Readonly<Record<string, unknown>>
	): Effect.Effect<void, never> =>
		Effect.sync(() => {
			logger?.info?.(`${operation} completed successfully`, metadata);

			if (featureFlags?.telemetryEnabled && telemetry?.trackEvent) {
				const sanitizedOperation = operation.toLowerCase().replace(/\s+/g, '');
				telemetry.trackEvent(`auth.${sanitizedOperation}.success`, metadata);
			}
		});

/**
 * Verification utility for logger calls.
 *
 * @description Helper to verify that a logger method was called with expected
 * message and metadata. Uses Vitest assertions.
 *
 * @param logger - Logger fixture with spy functions
 * @param level - Log level to verify ('debug' | 'info' | 'warn' | 'error')
 * @param expectedMessage - Expected log message (or partial match)
 * @param expectedMetadata - Expected metadata object (optional, uses expect.objectContaining if provided)
 *
 * @example
 * ```typescript
 * const logger = mockLoggerWithSpies();
 * logger.info('Test message', { userId: '123' });
 * verifyLoggerCalled(logger, 'info', 'Test message', { userId: '123' });
 * ```
 */
export const verifyLoggerCalled = (
	logger: ReturnType<typeof mockLoggerWithSpies>,
	level: 'debug' | 'info' | 'warn' | 'error',
	expectedMessage: string,
	expectedMetadata?: Record<string, unknown>
) => {
	const spy = logger[level];
	expect(spy).toHaveBeenCalled();

	const calls = spy.mock.calls;
	const matchingCall = calls.find((args: any[]) => args[0] && typeof args[0] === 'string' && args[0].includes(expectedMessage));

	if (!matchingCall) {
		throw new Error(
			`Expected logger.${level} to be called with message containing "${expectedMessage}", but it was not found in calls: ${JSON.stringify(calls)}`
		);
	}

	if (expectedMetadata) {
		const [, actualMetadata] = matchingCall;
		expect(actualMetadata).toMatchObject(expectedMetadata);
	}
};

/**
 * Verification utility for telemetry tracking.
 *
 * @description Helper to verify that telemetry.trackEvent was called with expected
 * event name and properties. Uses Vitest assertions.
 *
 * @param telemetry - Telemetry fixture with spy functions
 * @param expectedEvent - Expected event name (or partial match)
 * @param expectedProperties - Expected properties object (optional, uses expect.objectContaining if provided)
 *
 * @example
 * ```typescript
 * const telemetry = mockTelemetryWithSpies();
 * telemetry.trackEvent('auth.signup.success', { userId: '123' });
 * verifyTelemetryTracked(telemetry, 'auth.signup.success', { userId: '123' });
 * ```
 */
export const verifyTelemetryTracked = (
	telemetry: ReturnType<typeof mockTelemetryWithSpies>,
	expectedEvent: string,
	expectedProperties?: Record<string, unknown>
) => {
	const { trackEvent } = telemetry;
	expect(trackEvent).toHaveBeenCalled();

	const calls = trackEvent.mock.calls;
	const matchingCall = calls.find((args: any[]) => args[0] && typeof args[0] === 'string' && args[0].includes(expectedEvent));

	if (!matchingCall) {
		throw new Error(
			`Expected telemetry.trackEvent to be called with event containing "${expectedEvent}", but it was not found in calls: ${JSON.stringify(calls)}`
		);
	}

	if (expectedProperties) {
		const [, actualProperties] = matchingCall;
		expect(actualProperties).toMatchObject(expectedProperties);
	}
};

/**
 * Mock validation error fixture - dependencies error.
 *
 * @description Provides a mock EmailAuthDependenciesError for testing.
 *
 * @example
 * ```typescript
 * const error = mockValidationError_Deps();
 * const logFailure = mockCreateLogValidationFailure('Sign up');
 * await Effect.runPromise(logFailure(logger, error));
 * ```
 */
export const mockValidationError_Deps = () => new EmailAuthDependenciesError('Invalid dependencies provided to signUpEmail');

/**
 * Mock validation error fixture - input error.
 *
 * @description Provides a mock EmailAuthInputError for testing.
 *
 * @example
 * ```typescript
 * const error = mockValidationError_Input();
 * const logFailure = mockCreateLogValidationFailure('Sign in');
 * await Effect.runPromise(logFailure(logger, error));
 * ```
 */
export const mockValidationError_Input = () => new EmailAuthInputError('Invalid email address');

/**
 * Mock API error fixture - 401 Unauthorized.
 *
 * @description Provides a mock EmailAuthApiError for 401 failures.
 *
 * @example
 * ```typescript
 * const error = mockApiError_401();
 * const logFailure = mockCreateLogApiFailure('Sign in');
 * await Effect.runPromise(logFailure(logger, telemetry, featureFlags, error));
 * ```
 */
export const mockApiError_401 = () => new EmailAuthApiError('Authentication failed', 401, { message: 'Unauthorized' });

/**
 * Mock data missing error fixture.
 *
 * @description Provides a mock EmailAuthDataMissingError for testing.
 *
 * @example
 * ```typescript
 * const error = mockDataMissingError();
 * const logFailure = mockCreateLogDataMissingFailure('Sign up');
 * await Effect.runPromise(logFailure(logger, telemetry, featureFlags, error));
 * ```
 */
export const mockDataMissingError = () => new EmailAuthDataMissingError('User data is missing from API response');

/**
 * Mock session error fixture.
 *
 * @description Provides a mock EmailAuthSessionError for testing.
 *
 * @example
 * ```typescript
 * const error = mockSessionError();
 * const logFailure = mockCreateLogSessionFailure('Sign in');
 * await Effect.runPromise(logFailure(logger, telemetry, featureFlags, error));
 * ```
 */
export const mockSessionError = () => new EmailAuthSessionError('Session not found or expired');

/**
 * Helper to expect logger was not called.
 *
 * @description Verifies that no logger method was called. Useful for testing
 * scenarios where logging should be skipped (e.g., logger is undefined).
 *
 * @param logger - Logger fixture with spy functions
 *
 * @example
 * ```typescript
 * const logger = mockLoggerWithSpies();
 * expectLoggerNotCalled(logger);
 * ```
 */
export const expectLoggerNotCalled = (logger: ReturnType<typeof mockLoggerWithSpies>) => {
	expect(logger.debug).not.toHaveBeenCalled();
	expect(logger.info).not.toHaveBeenCalled();
	expect(logger.warn).not.toHaveBeenCalled();
	expect(logger.error).not.toHaveBeenCalled();
};

/**
 * Helper to expect telemetry was not tracked.
 *
 * @description Verifies that trackEvent was not called. Useful for testing
 * scenarios where telemetry should be skipped (e.g., telemetry disabled).
 *
 * @param telemetry - Telemetry fixture with spy functions
 *
 * @example
 * ```typescript
 * const telemetry = mockTelemetryWithSpies();
 * expectTelemetryNotTracked(telemetry);
 * ```
 */
export const expectTelemetryNotTracked = (telemetry: ReturnType<typeof mockTelemetryWithSpies>) => {
	expect(telemetry.trackEvent).not.toHaveBeenCalled();
};

// Re-export expect from Vitest for verification utilities
import { expect } from 'vitest';
