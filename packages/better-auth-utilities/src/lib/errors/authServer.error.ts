/**
 * @file libs/better-auth-utilities/src/lib/server/core/shared/core.error.ts
 * @description Centralized server-side error types and validation utilities for core authentication operations.
 */

import { APIError } from 'better-auth';
import { pipe } from 'effect/Function';
import * as Match from 'effect/Match';
import { z } from 'zod';
import type { AuthServerErrorDescriptor } from '../server/server.types';

/**
 * Error thrown when server dependencies validation fails.
 *
 * @pure
 * @description Indicates that the provided authServer dependency is invalid or missing.
 * This error occurs during the first stage of validation in the controller layer.
 */
export class AuthServerDependenciesError extends Error {
	readonly _tag = 'AuthServerDependenciesError' as const;
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'AuthServerDependenciesError';
		this.cause = cause;
	}
}

/**
 * Error thrown when server input validation fails.
 *
 * @pure
 * @description Indicates that the provided operation parameters (body, headers, etc.)
 * failed validation. This error occurs during the second stage of validation in the controller layer.
 */
export class AuthServerInputError extends Error {
	readonly _tag = 'AuthServerInputError' as const;
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'AuthServerInputError';
		this.cause = cause;
	}
}

/**
 * Error thrown when Better Auth server API call fails.
 *
 * @pure
 * @description Wraps errors from auth.api.* method calls, including Better Auth APIError instances.
 * Preserves HTTP status codes when available for proper error handling and response mapping.
 */
export class AuthServerApiError extends Error {
	readonly _tag = 'AuthServerApiError' as const;
	override readonly cause?: unknown;

	constructor(
		message: string,
		public readonly status?: number,
		cause?: unknown
	) {
		super(message);
		this.name = 'AuthServerApiError';
		this.cause = cause;
	}
}

/**
 * Error thrown when required data is missing from server response.
 *
 * @pure
 * @description Indicates that the Better Auth server API returned a response
 * but essential data (user, session, etc.) is missing or malformed.
 */
export class AuthServerDataMissingError extends Error {
	readonly _tag = 'AuthServerDataMissingError' as const;
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'AuthServerDataMissingError';
		this.cause = cause;
	}
}

/**
 * Error thrown when session operations fail on server.
 *
 * @pure
 * @description Indicates failures in session creation, retrieval, or validation
 * during server-side authentication operations.
 */
export class AuthServerSessionError extends Error {
	readonly _tag = 'AuthServerSessionError' as const;
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'AuthServerSessionError';
		this.cause = cause;
	}
}

/**
 * Discriminated union of all server-side core authentication errors.
 *
 * @pure
 * @description Enables type-safe error handling using Effect-TS Match.tag() pattern.
 */
export type AuthServerError = AuthServerDependenciesError | AuthServerInputError | AuthServerApiError | AuthServerDataMissingError | AuthServerSessionError;

export const mapApiError = (error: unknown): AuthServerApiError =>
	pipe(
		Match.value(error),
		Match.when(Match.instanceOf(APIError), (err) => {
			const status = typeof err.status === 'number' ? err.status : parseInt(err.status as string, 10) || undefined;
			return new AuthServerApiError(err.message, status, err);
		}),
		Match.when(Match.instanceOf(Error), (err) => new AuthServerApiError(err.message, undefined, err)),
		Match.orElse((err) => new AuthServerApiError('Unknown auth server error', undefined, err))
	);

/**
 * Type guard for ZodError detection.
 *
 * @pure
 * @description Checks if an error is a ZodError by examining its structure.
 */
export const isZodError = (error: unknown): error is z.ZodError => {
	return (
		error !== null &&
		typeof error === 'object' &&
		'issues' in error &&
		Array.isArray((error as z.ZodError).issues) &&
		'name' in error &&
		(error as z.ZodError).name === 'ZodError'
	);
};

export const describeError = (error: AuthServerError): AuthServerErrorDescriptor =>
	pipe(
		Match.value(error),
		Match.tag('AuthServerInputError', (err) => ({
			_tag: 'AuthErrorDescriptor' as const,
			category: 'input' as const,
			code: 'invalid_input' as const,
			message: err.message,
			cause: err.cause,
			status: 400,
		})),
		Match.tag('AuthServerApiError', (err) => {
			if (err.status === 401) {
				return {
					_tag: 'AuthErrorDescriptor' as const,
					category: 'unauthorized' as const,
					code: 'invalid_credentials' as const,
					message: err.message,
					status: 401,
					cause: err.cause,
				};
			}
			if (err.status === 409) {
				return {
					_tag: 'AuthErrorDescriptor' as const,
					category: 'conflict' as const,
					code: 'user_already_exists' as const,
					message: err.message,
					status: 409,
					cause: err.cause,
				};
			}
			return {
				_tag: 'AuthErrorDescriptor' as const,
				category: 'server' as const,
				code: 'auth_server_error' as const,
				message: err.message,
				status: err.status ?? 500,
				cause: err.cause,
			};
		}),
		Match.tag('AuthServerSessionError', (err) => ({
			_tag: 'AuthErrorDescriptor' as const,
			category: 'unauthorized' as const,
			code: 'session_error' as const,
			message: err.message,
			status: 401,
			cause: err.cause,
		})),
		Match.tag('AuthServerDependenciesError', (err) => ({
			_tag: 'AuthErrorDescriptor' as const,
			category: 'dependency' as const,
			code: 'dependency_error' as const,
			message: err.message,
			status: 500,
			cause: err.cause,
		})),
		Match.tag('AuthServerDataMissingError', (err) => ({
			_tag: 'AuthErrorDescriptor' as const,
			category: 'server' as const,
			code: 'data_missing' as const,
			message: err.message,
			status: 500,
			cause: err.cause,
		})),
		Match.exhaustive
	);
