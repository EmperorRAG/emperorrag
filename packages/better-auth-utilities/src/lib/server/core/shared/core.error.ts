/**
 * @file libs/better-auth-utilities/src/lib/server/core/shared/core.error.ts
 * @description Centralized server-side error types and validation utilities for core authentication operations.
 */

import type { AuthServerErrorDescriptor } from '../../server.types';
import { APIError } from 'better-auth';
import { z } from 'zod';
import * as Effect from 'effect/Effect';

/**
 * Error thrown when server dependencies validation fails.
 *
 * @pure
 * @description Indicates that the provided authServer dependency is invalid or missing.
 * This error occurs during the first stage of validation in the controller layer.
 */
export class CoreAuthServerDependenciesError extends Error {
	readonly _tag = 'CoreAuthServerDependenciesError' as const;
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'CoreAuthServerDependenciesError';
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
export class CoreAuthServerInputError extends Error {
	readonly _tag = 'CoreAuthServerInputError' as const;
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'CoreAuthServerInputError';
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
export class CoreAuthServerApiError extends Error {
	readonly _tag = 'CoreAuthServerApiError' as const;
	override readonly cause?: unknown;

	constructor(
		message: string,
		public readonly status?: number,
		cause?: unknown
	) {
		super(message);
		this.name = 'CoreAuthServerApiError';
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
export class CoreAuthServerDataMissingError extends Error {
	readonly _tag = 'CoreAuthServerDataMissingError' as const;
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'CoreAuthServerDataMissingError';
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
export class CoreAuthServerSessionError extends Error {
	readonly _tag = 'CoreAuthServerSessionError' as const;
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'CoreAuthServerSessionError';
		this.cause = cause;
	}
}

/**
 * Discriminated union of all server-side core authentication errors.
 *
 * @pure
 * @description Enables type-safe error handling using Effect-TS Match.tag() pattern.
 */
export type CoreAuthServerError =
	| CoreAuthServerDependenciesError
	| CoreAuthServerInputError
	| CoreAuthServerApiError
	| CoreAuthServerDataMissingError
	| CoreAuthServerSessionError;

export const mapBetterAuthApiErrorToCoreAuthError = (error: unknown): CoreAuthServerApiError => {
	if (error instanceof APIError) {
		const status = typeof error.status === 'number' ? error.status : parseInt(error.status as string, 10) || undefined;

		return new CoreAuthServerApiError(error.message, status, error);
	}

	const message = error instanceof Error ? error.message : 'Unknown auth server error';

	return new CoreAuthServerApiError(message, undefined, error);
};

/**
 * Input validation error source types for traceability.
 *
 * @pure
 * @description Enables tracing of where the input validation error originated in the workflow.
 */
export type CoreInputErrorSource = 'schema_creation' | 'schema_parsing' | 'type_guard_validation' | 'field_validation';

/**
 * Detailed input validation error with source tracing.
 *
 * @pure
 * @description Contains structured information about input validation failures,
 * including the source of the error, field-level details, and the original cause.
 */
export interface CoreInputValidationDetails {
	readonly source: CoreInputErrorSource;
	readonly operation: string;
	readonly fieldErrors?: ReadonlyArray<{ path: string; message: string }>;
}

/**
 * Maps input validation errors to CoreAuthServerInputError with full traceability.
 *
 * @pure
 * @description Converts various input validation error types (ZodError, type guard failures,
 * schema creation errors) into a standardized CoreAuthServerInputError with detailed
 * traceability information about where in the workflow the error occurred.
 */
export const mapBetterAuthInputErrorToCoreAuthError = (error: unknown, source: CoreInputErrorSource, operation: string): CoreAuthServerInputError => {
	const details: CoreInputValidationDetails = {
		source,
		operation,
	};

	if (isZodError(error)) {
		const fieldErrors = error.issues.map((issue) => ({
			path: issue.path.join('.'),
			message: issue.message,
		}));

		const detailsWithFields: CoreInputValidationDetails = {
			...details,
			fieldErrors,
		};

		const message = formatZodErrorMessage(error, operation);
		return new CoreAuthServerInputError(message, { zodError: error, details: detailsWithFields });
	}

	if (error instanceof Error) {
		return new CoreAuthServerInputError(error.message, { originalError: error, details });
	}

	const message = `Invalid ${operation} parameters: ${source} failed`;
	return new CoreAuthServerInputError(message, { originalError: error, details });
};

/**
 * Type guard for ZodError detection.
 *
 * @pure
 * @description Checks if an error is a ZodError by examining its structure.
 */
const isZodError = (error: unknown): error is z.ZodError => {
	return (
		error !== null &&
		typeof error === 'object' &&
		'issues' in error &&
		Array.isArray((error as z.ZodError).issues) &&
		'name' in error &&
		(error as z.ZodError).name === 'ZodError'
	);
};

/**
 * Formats ZodError into a human-readable message.
 *
 * @pure
 * @description Creates a structured error message from ZodError field-level issues.
 */
const formatZodErrorMessage = (error: z.ZodError, operation: string): string => {
	const fieldMessages = error.issues
		.map((issue) => {
			const path = issue.path.length > 0 ? issue.path.join('.') : 'input';
			return `${path}: ${issue.message}`;
		})
		.join('; ');

	return `Invalid ${operation} parameters: ${fieldMessages}`;
};

/**
 * Creates a schema creation Effect with proper error mapping.
 *
 * @pure
 * @description Wraps schema creation in an Effect that maps any errors to
 * CoreAuthServerInputError with 'schema_creation' source for traceability.
 */
export const createSchemaEffect = <T extends z.ZodType, R = never>(
	schemaEffect: Effect.Effect<T, unknown, R>,
	operation: string
): Effect.Effect<T, CoreAuthServerInputError, R> =>
	Effect.mapError(schemaEffect, (error) => mapBetterAuthInputErrorToCoreAuthError(error, 'schema_creation', operation));

/**
 * Parses input against a Zod schema and returns an Effect.
 *
 * @pure
 * @description Validates input against the provided schema and wraps the result
 * in an Effect. Failed validation returns a properly traced CoreAuthServerInputError.
 */
export const parseWithSchemaEffect = <T>(schema: z.ZodType<T>, input: unknown, operation: string): Effect.Effect<T, CoreAuthServerInputError> =>
	Effect.suspend(() => {
		const result = schema.safeParse(input);

		if (result.success) {
			return Effect.succeed(result.data);
		}

		return Effect.fail(mapBetterAuthInputErrorToCoreAuthError(result.error, 'schema_parsing', operation));
	});

/**
 * Validates input with a type guard and returns an Effect.
 *
 * @pure
 * @description Applies a type guard to validated data and returns an Effect.
 * If the type guard fails, returns a traced CoreAuthServerInputError.
 */
export const validateWithTypeGuardEffect = <T>(
	data: unknown,
	typeGuard: (value: unknown) => value is T,
	operation: string
): Effect.Effect<T, CoreAuthServerInputError> =>
	Effect.suspend(() => {
		if (typeGuard(data)) {
			return Effect.succeed(data);
		}

		const error = new Error('Data does not conform to expected structure');
		return Effect.fail(mapBetterAuthInputErrorToCoreAuthError(error, 'type_guard_validation', operation));
	});

/**
 * Composes schema creation, parsing, and type guard validation into a single Effect.
 *
 * @pure
 * @description Creates a complete validation pipeline that:
 * 1. Creates the schema (with error tracing)
 * 2. Parses input against the schema (with error tracing)
 * 3. Validates with type guard (with error tracing)
 *
 * Each step in the pipeline produces a traceable error if it fails,
 * enabling precise identification of where validation failed.
 */
export const validateInputEffect = <T, R>(
	schemaEffect: Effect.Effect<z.ZodType, unknown, R>,
	input: unknown,
	typeGuard: (value: unknown) => value is T,
	operation: string
): Effect.Effect<T, CoreAuthServerInputError, R> =>
	Effect.gen(function* () {
		const schema = yield* createSchemaEffect(schemaEffect, operation);
		const parsed = yield* parseWithSchemaEffect(schema, input, operation);
		const validated = yield* validateWithTypeGuardEffect(parsed, typeGuard, operation);
		return validated;
	});

export const describeCoreAuthError = (error: CoreAuthServerError): AuthServerErrorDescriptor => {
	switch (error._tag) {
		case 'CoreAuthServerInputError':
			return {
				_tag: 'AuthErrorDescriptor',
				category: 'input',
				code: 'invalid_input',
				message: error.message,
				cause: error.cause,
				status: 400,
			};

		case 'CoreAuthServerApiError': {
			if (error.status === 401) {
				return {
					_tag: 'AuthErrorDescriptor',
					category: 'unauthorized',
					code: 'invalid_credentials',
					message: error.message,
					status: 401,
					cause: error.cause,
				};
			}
			if (error.status === 409) {
				return {
					_tag: 'AuthErrorDescriptor',
					category: 'conflict',
					code: 'user_already_exists',
					message: error.message,
					status: 409,
					cause: error.cause,
				};
			}
			return {
				_tag: 'AuthErrorDescriptor',
				category: 'server',
				code: 'auth_server_error',
				message: error.message,
				status: error.status ?? 500,
				cause: error.cause,
			};
		}

		case 'CoreAuthServerSessionError':
			return {
				_tag: 'AuthErrorDescriptor',
				category: 'unauthorized',
				code: 'session_error',
				message: error.message,
				status: 401,
				cause: error.cause,
			};

		case 'CoreAuthServerDependenciesError':
			return {
				_tag: 'AuthErrorDescriptor',
				category: 'dependency',
				code: 'dependency_error',
				message: error.message,
				status: 500,
				cause: error.cause,
			};

		case 'CoreAuthServerDataMissingError':
			return {
				_tag: 'AuthErrorDescriptor',
				category: 'server',
				code: 'data_missing',
				message: error.message,
				status: 500,
				cause: error.cause,
			};
	}
};
