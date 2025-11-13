/**
 * Unit tests for logging utilities.
 *
 * @description This module contains comprehensive unit tests for the logging
 * utilities used in email authentication operations. Tests cover all 5 logging
 * factory functions with various scenarios including feature flags, optional
 * dependencies, and telemetry tracking.
 */

import { describe, test, expect } from 'vitest';
import { Effect } from 'effect';
import {
	mockCreateLogValidationFailure,
	mockCreateLogApiFailure,
	mockCreateLogDataMissingFailure,
	mockCreateLogSessionFailure,
	mockCreateLogSuccess,
	mockLoggerWithSpies,
	mockTelemetryWithSpies,
	mockValidationError_Deps,
	mockValidationError_Input,
	mockApiError_401,
	mockDataMissingError,
	mockSessionError,
	verifyLoggerCalled,
	verifyTelemetryTracked,
	expectTelemetryNotTracked,
} from './logging.mocks.js';

describe('logging utilities', () => {
	describe('createLogValidationFailure', () => {
		test('logs validation error with dependencies error', async () => {
			const logger = mockLoggerWithSpies();
			const error = mockValidationError_Deps();
			const logValidationFailure = mockCreateLogValidationFailure('Sign up');

			await Effect.runPromise(logValidationFailure(logger, error));

			verifyLoggerCalled(logger, 'error', 'Sign up validation failed', {
				error: error.message,
				errorType: error._tag,
			});
		});

		test('logs validation error with input error', async () => {
			const logger = mockLoggerWithSpies();
			const error = mockValidationError_Input();
			const logValidationFailure = mockCreateLogValidationFailure('Sign in');

			await Effect.runPromise(logValidationFailure(logger, error));

			verifyLoggerCalled(logger, 'error', 'Sign in validation failed', {
				error: error.message,
				errorType: error._tag,
			});
		});

		test('includes operation name in log message', async () => {
			const logger = mockLoggerWithSpies();
			const error = mockValidationError_Input();
			const logValidationFailure = mockCreateLogValidationFailure('Custom Operation');

			await Effect.runPromise(logValidationFailure(logger, error));

			verifyLoggerCalled(logger, 'error', 'Custom Operation validation failed');
		});

		test('handles undefined logger gracefully', async () => {
			const error = mockValidationError_Input();
			const logValidationFailure = mockCreateLogValidationFailure('Sign up');

			await Effect.runPromise(logValidationFailure(undefined, error));
			// Should not throw, Effect completes successfully
		});

		test('returns Effect that never fails', async () => {
			const logger = mockLoggerWithSpies();
			const error = mockValidationError_Deps();
			const logValidationFailure = mockCreateLogValidationFailure('Sign up');

			const effect = logValidationFailure(logger, error);
			const result = await Effect.runPromise(effect);

			expect(result).toBeUndefined();
		});
	});

	describe('createLogApiFailure', () => {
		test('logs API error with status', async () => {
			const logger = mockLoggerWithSpies();
			const telemetry = mockTelemetryWithSpies();
			const featureFlags = { telemetryEnabled: false };
			const error = mockApiError_401();
			const logApiFailure = mockCreateLogApiFailure('Sign in');

			await Effect.runPromise(logApiFailure(logger, telemetry, featureFlags, error));

			verifyLoggerCalled(logger, 'error', 'Sign in API call failed', {
				error: error.message,
				status: error.status,
			});
		});

		test('tracks telemetry when telemetryEnabled is true', async () => {
			const logger = mockLoggerWithSpies();
			const telemetry = mockTelemetryWithSpies();
			const featureFlags = { telemetryEnabled: true };
			const error = mockApiError_401();
			const logApiFailure = mockCreateLogApiFailure('Sign in');

			await Effect.runPromise(logApiFailure(logger, telemetry, featureFlags, error));

			verifyTelemetryTracked(telemetry, 'auth.signin.failure', {
				error: error.message,
				status: error.status,
			});
		});

		test('does not track telemetry when telemetryEnabled is false', async () => {
			const logger = mockLoggerWithSpies();
			const telemetry = mockTelemetryWithSpies();
			const featureFlags = { telemetryEnabled: false };
			const error = mockApiError_401();
			const logApiFailure = mockCreateLogApiFailure('Sign in');

			await Effect.runPromise(logApiFailure(logger, telemetry, featureFlags, error));

			expectTelemetryNotTracked(telemetry);
		});

		test('sanitizes operation name for telemetry event', async () => {
			const logger = mockLoggerWithSpies();
			const telemetry = mockTelemetryWithSpies();
			const featureFlags = { telemetryEnabled: true };
			const error = mockApiError_401();
			const logApiFailure = mockCreateLogApiFailure('Sign Up Email');

			await Effect.runPromise(logApiFailure(logger, telemetry, featureFlags, error));

			verifyTelemetryTracked(telemetry, 'auth.signupemail.failure');
		});

		test('handles undefined logger gracefully', async () => {
			const telemetry = mockTelemetryWithSpies();
			const featureFlags = { telemetryEnabled: true };
			const error = mockApiError_401();
			const logApiFailure = mockCreateLogApiFailure('Sign in');

			await Effect.runPromise(logApiFailure(undefined, telemetry, featureFlags, error));

			verifyTelemetryTracked(telemetry, 'auth.signin.failure');
		});

		test('handles undefined telemetry gracefully', async () => {
			const logger = mockLoggerWithSpies();
			const featureFlags = { telemetryEnabled: true };
			const error = mockApiError_401();
			const logApiFailure = mockCreateLogApiFailure('Sign in');

			await Effect.runPromise(logApiFailure(logger, undefined, featureFlags, error));

			verifyLoggerCalled(logger, 'error', 'Sign in API call failed');
		});

		test('returns Effect that never fails', async () => {
			const logger = mockLoggerWithSpies();
			const telemetry = mockTelemetryWithSpies();
			const featureFlags = { telemetryEnabled: true };
			const error = mockApiError_401();
			const logApiFailure = mockCreateLogApiFailure('Sign in');

			const effect = logApiFailure(logger, telemetry, featureFlags, error);
			const result = await Effect.runPromise(effect);

			expect(result).toBeUndefined();
		});
	});

	describe('createLogDataMissingFailure', () => {
		test('logs data missing error', async () => {
			const logger = mockLoggerWithSpies();
			const telemetry = mockTelemetryWithSpies();
			const featureFlags = { telemetryEnabled: false };
			const error = mockDataMissingError();
			const logDataMissing = mockCreateLogDataMissingFailure('Sign up');

			await Effect.runPromise(logDataMissing(logger, telemetry, featureFlags, error));

			verifyLoggerCalled(logger, 'error', 'Sign up data missing', {
				error: error.message,
			});
		});

		test('tracks telemetry when telemetryEnabled is true', async () => {
			const logger = mockLoggerWithSpies();
			const telemetry = mockTelemetryWithSpies();
			const featureFlags = { telemetryEnabled: true };
			const error = mockDataMissingError();
			const logDataMissing = mockCreateLogDataMissingFailure('Sign up');

			await Effect.runPromise(logDataMissing(logger, telemetry, featureFlags, error));

			verifyTelemetryTracked(telemetry, 'auth.signup.dataMissing', {
				error: error.message,
			});
		});

		test('does not track telemetry when telemetryEnabled is false', async () => {
			const logger = mockLoggerWithSpies();
			const telemetry = mockTelemetryWithSpies();
			const featureFlags = { telemetryEnabled: false };
			const error = mockDataMissingError();
			const logDataMissing = mockCreateLogDataMissingFailure('Sign up');

			await Effect.runPromise(logDataMissing(logger, telemetry, featureFlags, error));

			expectTelemetryNotTracked(telemetry);
		});

		test('sanitizes operation name for telemetry event', async () => {
			const logger = mockLoggerWithSpies();
			const telemetry = mockTelemetryWithSpies();
			const featureFlags = { telemetryEnabled: true };
			const error = mockDataMissingError();
			const logDataMissing = mockCreateLogDataMissingFailure('Sign In Email');

			await Effect.runPromise(logDataMissing(logger, telemetry, featureFlags, error));

			verifyTelemetryTracked(telemetry, 'auth.signinemail.dataMissing');
		});

		test('handles undefined logger gracefully', async () => {
			const telemetry = mockTelemetryWithSpies();
			const featureFlags = { telemetryEnabled: true };
			const error = mockDataMissingError();
			const logDataMissing = mockCreateLogDataMissingFailure('Sign up');

			await Effect.runPromise(logDataMissing(undefined, telemetry, featureFlags, error));

			verifyTelemetryTracked(telemetry, 'auth.signup.dataMissing');
		});

		test('handles undefined telemetry gracefully', async () => {
			const logger = mockLoggerWithSpies();
			const featureFlags = { telemetryEnabled: true };
			const error = mockDataMissingError();
			const logDataMissing = mockCreateLogDataMissingFailure('Sign up');

			await Effect.runPromise(logDataMissing(logger, undefined, featureFlags, error));

			verifyLoggerCalled(logger, 'error', 'Sign up data missing');
		});
	});

	describe('createLogSessionFailure', () => {
		test('logs session error', async () => {
			const logger = mockLoggerWithSpies();
			const telemetry = mockTelemetryWithSpies();
			const featureFlags = { telemetryEnabled: false };
			const error = mockSessionError();
			const logSessionFailure = mockCreateLogSessionFailure('Sign in');

			await Effect.runPromise(logSessionFailure(logger, telemetry, featureFlags, error));

			verifyLoggerCalled(logger, 'error', 'Sign in session error', {
				error: error.message,
			});
		});

		test('tracks telemetry when telemetryEnabled is true', async () => {
			const logger = mockLoggerWithSpies();
			const telemetry = mockTelemetryWithSpies();
			const featureFlags = { telemetryEnabled: true };
			const error = mockSessionError();
			const logSessionFailure = mockCreateLogSessionFailure('Sign in');

			await Effect.runPromise(logSessionFailure(logger, telemetry, featureFlags, error));

			verifyTelemetryTracked(telemetry, 'auth.signin.sessionFailure', {
				error: error.message,
			});
		});

		test('does not track telemetry when telemetryEnabled is false', async () => {
			const logger = mockLoggerWithSpies();
			const telemetry = mockTelemetryWithSpies();
			const featureFlags = { telemetryEnabled: false };
			const error = mockSessionError();
			const logSessionFailure = mockCreateLogSessionFailure('Sign in');

			await Effect.runPromise(logSessionFailure(logger, telemetry, featureFlags, error));

			expectTelemetryNotTracked(telemetry);
		});

		test('sanitizes operation name for telemetry event', async () => {
			const logger = mockLoggerWithSpies();
			const telemetry = mockTelemetryWithSpies();
			const featureFlags = { telemetryEnabled: true };
			const error = mockSessionError();
			const logSessionFailure = mockCreateLogSessionFailure('Sign Out Email');

			await Effect.runPromise(logSessionFailure(logger, telemetry, featureFlags, error));

			verifyTelemetryTracked(telemetry, 'auth.signoutemail.sessionFailure');
		});

		test('handles undefined logger gracefully', async () => {
			const telemetry = mockTelemetryWithSpies();
			const featureFlags = { telemetryEnabled: true };
			const error = mockSessionError();
			const logSessionFailure = mockCreateLogSessionFailure('Sign in');

			await Effect.runPromise(logSessionFailure(undefined, telemetry, featureFlags, error));

			verifyTelemetryTracked(telemetry, 'auth.signin.sessionFailure');
		});

		test('handles undefined telemetry gracefully', async () => {
			const logger = mockLoggerWithSpies();
			const featureFlags = { telemetryEnabled: true };
			const error = mockSessionError();
			const logSessionFailure = mockCreateLogSessionFailure('Sign in');

			await Effect.runPromise(logSessionFailure(logger, undefined, featureFlags, error));

			verifyLoggerCalled(logger, 'error', 'Sign in session error');
		});
	});

	describe('createLogSuccess', () => {
		test('logs success with metadata', async () => {
			const logger = mockLoggerWithSpies();
			const telemetry = mockTelemetryWithSpies();
			const featureFlags = { telemetryEnabled: false };
			const metadata = { userId: 'user-123', email: 'test@example.com' };
			const logSuccess = mockCreateLogSuccess('Sign up');

			await Effect.runPromise(logSuccess(logger, telemetry, featureFlags, metadata));

			verifyLoggerCalled(logger, 'info', 'Sign up completed successfully', metadata);
		});

		test('tracks telemetry when telemetryEnabled is true', async () => {
			const logger = mockLoggerWithSpies();
			const telemetry = mockTelemetryWithSpies();
			const featureFlags = { telemetryEnabled: true };
			const metadata = { userId: 'user-123', email: 'test@example.com' };
			const logSuccess = mockCreateLogSuccess('Sign up');

			await Effect.runPromise(logSuccess(logger, telemetry, featureFlags, metadata));

			verifyTelemetryTracked(telemetry, 'auth.signup.success', metadata);
		});

		test('does not track telemetry when telemetryEnabled is false', async () => {
			const logger = mockLoggerWithSpies();
			const telemetry = mockTelemetryWithSpies();
			const featureFlags = { telemetryEnabled: false };
			const metadata = { userId: 'user-123' };
			const logSuccess = mockCreateLogSuccess('Sign up');

			await Effect.runPromise(logSuccess(logger, telemetry, featureFlags, metadata));

			expectTelemetryNotTracked(telemetry);
		});

		test('sanitizes operation name for telemetry event', async () => {
			const logger = mockLoggerWithSpies();
			const telemetry = mockTelemetryWithSpies();
			const featureFlags = { telemetryEnabled: true };
			const metadata = { userId: 'user-123' };
			const logSuccess = mockCreateLogSuccess('Sign In Email');

			await Effect.runPromise(logSuccess(logger, telemetry, featureFlags, metadata));

			verifyTelemetryTracked(telemetry, 'auth.signinemail.success');
		});

		test('includes operation name in log message', async () => {
			const logger = mockLoggerWithSpies();
			const telemetry = mockTelemetryWithSpies();
			const featureFlags = { telemetryEnabled: false };
			const metadata = { userId: 'user-123' };
			const logSuccess = mockCreateLogSuccess('Custom Operation');

			await Effect.runPromise(logSuccess(logger, telemetry, featureFlags, metadata));

			verifyLoggerCalled(logger, 'info', 'Custom Operation completed successfully');
		});

		test('handles undefined logger gracefully', async () => {
			const telemetry = mockTelemetryWithSpies();
			const featureFlags = { telemetryEnabled: true };
			const metadata = { userId: 'user-123' };
			const logSuccess = mockCreateLogSuccess('Sign up');

			await Effect.runPromise(logSuccess(undefined, telemetry, featureFlags, metadata));

			verifyTelemetryTracked(telemetry, 'auth.signup.success');
		});

		test('handles undefined telemetry gracefully', async () => {
			const logger = mockLoggerWithSpies();
			const featureFlags = { telemetryEnabled: true };
			const metadata = { userId: 'user-123' };
			const logSuccess = mockCreateLogSuccess('Sign up');

			await Effect.runPromise(logSuccess(logger, undefined, featureFlags, metadata));

			verifyLoggerCalled(logger, 'info', 'Sign up completed successfully');
		});

		test('returns Effect that never fails', async () => {
			const logger = mockLoggerWithSpies();
			const telemetry = mockTelemetryWithSpies();
			const featureFlags = { telemetryEnabled: true };
			const metadata = { userId: 'user-123' };
			const logSuccess = mockCreateLogSuccess('Sign up');

			const effect = logSuccess(logger, telemetry, featureFlags, metadata);
			const result = await Effect.runPromise(effect);

			expect(result).toBeUndefined();
		});
	});
});
