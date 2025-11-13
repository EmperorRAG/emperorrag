/**
 * Logging utilities for email authentication operations.
 *
 * @description This module provides generic logging utility factories for email
 * authentication operations. Each factory function creates operation-specific
 * loggers that maintain consistent logging patterns across all auth operations.
 */

import { Effect } from 'effect';
import type { EmailAuthClientDeps } from '../email.types.js';
import type {
	EmailAuthDependenciesError,
	EmailAuthInputError,
	EmailAuthApiError,
	EmailAuthDataMissingError,
	EmailAuthSessionError,
} from '../email.error.js';

/**
 * Creates a validation failure logger for a specific operation.
 *
 * @description Factory function that creates operation-specific validation
 * failure loggers. Returns an Effect-wrapped logger that logs validation
 * errors (dependencies or input errors) with operation context.
 *
 * @fp-pattern Factory function for operation-specific logging
 *
 * @param operation - Human-readable operation name (e.g., 'Sign in', 'Sign out')
 * @returns {(logger, error) => Effect.Effect<void, never>}
 *   Effect-wrapped logger function that never fails
 *
 * @example
 * ```typescript
 * const logSignInValidationFailure = createLogValidationFailure('Sign in');
 * const effect = logSignInValidationFailure(
 *   logger,
 *   new EmailAuthInputError('Invalid email')
 * );
 * // Logs: "Sign in validation failed" with error details
 * ```
 */
export const createLogValidationFailure = (operation: string) =>
	(
		logger: EmailAuthClientDeps['logger'],
		error: EmailAuthDependenciesError | EmailAuthInputError
	): Effect.Effect<void, never> =>
		Effect.sync(() => {
			logger?.error?.(`${operation} validation failed`, {
				operation,
				errorType: error._tag,
				message: error.message,
			});
		});

/**
 * Creates an API failure logger for a specific operation.
 *
 * @description Factory function that creates operation-specific API failure
 * loggers. Returns an Effect-wrapped logger that logs API errors with telemetry
 * tracking and feature flag context.
 *
 * @fp-pattern Factory function for operation-specific logging
 *
 * @param operation - Human-readable operation name (e.g., 'Sign in', 'Sign out')
 * @returns {(logger, telemetry, featureFlags, error) => Effect.Effect<void, never>}
 *   Effect-wrapped logger function that never fails
 *
 * @example
 * ```typescript
 * const logSignInApiFailure = createLogApiFailure('Sign in');
 * const effect = logSignInApiFailure(
 *   logger,
 *   telemetry,
 *   featureFlags,
 *   new EmailAuthApiError('Sign in failed', 401)
 * );
 * // Logs: "Sign in API call failed" and tracks event "auth.signIn.failed"
 * ```
 */
export const createLogApiFailure = (operation: string) =>
	(
		logger: EmailAuthClientDeps['logger'],
		telemetry: EmailAuthClientDeps['telemetry'],
		featureFlags: EmailAuthClientDeps['featureFlags'],
		error: EmailAuthApiError
	): Effect.Effect<void, never> =>
		Effect.sync(() => {
			logger?.error?.(`${operation} API call failed`, {
				operation,
				errorType: error._tag,
				message: error.message,
				status: error.status,
			});

			void telemetry?.trackEvent?.(`auth.${operation.replace(/\s+/g, '')}.failed`, {
				errorStatus: error.status,
				errorMessage: error.message,
				featureFlags,
			});
		});

/**
 * Creates a data missing failure logger for a specific operation.
 *
 * @description Factory function that creates operation-specific data missing
 * failure loggers. Returns an Effect-wrapped logger for when required data is
 * missing from API responses.
 *
 * @fp-pattern Factory function for operation-specific logging
 *
 * @param operation - Human-readable operation name (e.g., 'Sign in', 'Sign up')
 * @returns {(logger, telemetry, featureFlags, error) => Effect.Effect<void, never>}
 *   Effect-wrapped logger function that never fails
 *
 * @example
 * ```typescript
 * const logSignInDataMissingFailure = createLogDataMissingFailure('Sign in');
 * const effect = logSignInDataMissingFailure(
 *   logger,
 *   telemetry,
 *   featureFlags,
 *   new EmailAuthDataMissingError('User payload missing')
 * );
 * // Logs: "Sign in data missing" and tracks event "auth.signIn.dataMissing"
 * ```
 */
export const createLogDataMissingFailure = (operation: string) =>
	(
		logger: EmailAuthClientDeps['logger'],
		telemetry: EmailAuthClientDeps['telemetry'],
		featureFlags: EmailAuthClientDeps['featureFlags'],
		error: EmailAuthDataMissingError
	): Effect.Effect<void, never> =>
		Effect.sync(() => {
			logger?.error?.(`${operation} data missing`, {
				operation,
				errorType: error._tag,
				message: error.message,
			});

			void telemetry?.trackEvent?.(`auth.${operation.replace(/\s+/g, '')}.dataMissing`, {
				errorMessage: error.message,
				featureFlags,
			});
		});

/**
 * Creates a session failure logger for a specific operation.
 *
 * @description Factory function that creates operation-specific session failure
 * loggers. Returns an Effect-wrapped logger for session resolution/validation
 * errors.
 *
 * @fp-pattern Factory function for operation-specific logging
 *
 * @param operation - Human-readable operation name (e.g., 'Sign in', 'Sign up')
 * @returns {(logger, telemetry, featureFlags, error) => Effect.Effect<void, never>}
 *   Effect-wrapped logger function that never fails
 *
 * @example
 * ```typescript
 * const logSignUpSessionFailure = createLogSessionFailure('Sign up');
 * const effect = logSignUpSessionFailure(
 *   logger,
 *   telemetry,
 *   featureFlags,
 *   new EmailAuthSessionError('Session resolution failed')
 * );
 * // Logs: "Sign up session failed" and tracks event "auth.signUp.sessionFailed"
 * ```
 */
export const createLogSessionFailure = (operation: string) =>
	(
		logger: EmailAuthClientDeps['logger'],
		telemetry: EmailAuthClientDeps['telemetry'],
		featureFlags: EmailAuthClientDeps['featureFlags'],
		error: EmailAuthSessionError
	): Effect.Effect<void, never> =>
		Effect.sync(() => {
			logger?.error?.(`${operation} session failed`, {
				operation,
				errorType: error._tag,
				message: error.message,
			});

			void telemetry?.trackEvent?.(`auth.${operation.replace(/\s+/g, '')}.sessionFailed`, {
				errorMessage: error.message,
				featureFlags,
			});
		});

/**
 * Generic success logger factory.
 *
 * @description Factory function that creates operation-specific success loggers.
 * Returns an Effect-wrapped logger that logs successful operation completion
 * with custom metadata and telemetry tracking.
 *
 * @fp-pattern Factory function for operation-specific logging
 *
 * @param operation - Human-readable operation name (e.g., 'Sign in', 'Sign out')
 * @returns {(logger, telemetry, featureFlags, metadata) => Effect.Effect<void, never>}
 *   Effect-wrapped logger function that never fails
 *
 * @example
 * ```typescript
 * const logSignInSuccess = createLogSuccess('Sign in');
 * const effect = logSignInSuccess(
 *   logger,
 *   telemetry,
 *   featureFlags,
 *   { userId: '123', sessionId: 'abc' }
 * );
 * // Logs: "Sign in completed successfully" and tracks event "auth.signIn.success"
 * ```
 */
export const createLogSuccess = (operation: string) =>
	(
		logger: EmailAuthClientDeps['logger'],
		telemetry: EmailAuthClientDeps['telemetry'],
		featureFlags: EmailAuthClientDeps['featureFlags'],
		metadata: Readonly<Record<string, unknown>>
	): Effect.Effect<void, never> =>
		Effect.sync(() => {
			logger?.info?.(`${operation} completed successfully`, {
				operation,
				...metadata,
			});

			void telemetry?.trackEvent?.(`auth.${operation.replace(/\s+/g, '')}.success`, {
				...metadata,
				featureFlags,
			});
		});
