/**
 * @file libs/better-auth-utilities/src/lib/core/user/server/shared/user.error.ts
 * @description Server-side error types for user authentication operations.
 */

import type { AuthServerErrorDescriptor } from '../../../server.types';
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
export class UserAuthServerDependenciesError extends Error {
	readonly _tag = 'UserAuthServerDependenciesError' as const;
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'UserAuthServerDependenciesError';
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
export class UserAuthServerInputError extends Error {
	readonly _tag = 'UserAuthServerInputError' as const;
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'UserAuthServerInputError';
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
export class UserAuthServerApiError extends Error {
	readonly _tag = 'UserAuthServerApiError' as const;
	override readonly cause?: unknown;

	constructor(
		message: string,
		public readonly status?: number,
		cause?: unknown
	) {
		super(message);
		this.name = 'UserAuthServerApiError';
		this.cause = cause;
	}
}

/**
 * Error thrown when required data is missing from server response.
 *
 * @pure
 * @description Indicates that the Better Auth server API returned a response
 * but essential data (user, etc.) is missing or malformed.
 */
export class UserAuthServerDataMissingError extends Error {
	readonly _tag = 'UserAuthServerDataMissingError' as const;
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'UserAuthServerDataMissingError';
		this.cause = cause;
	}
}

/**
 * Error thrown when session operations fail on server.
 *
 * @pure
 * @description Indicates failures in session creation, retrieval, or validation
 * during server-side user operations.
 */
export class UserAuthServerSessionError extends Error {
	readonly _tag = 'UserAuthServerSessionError' as const;
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'UserAuthServerSessionError';
		this.cause = cause;
	}
}

/**
 * Union type of all user auth server errors.
 *
 * @pure
 * @description Represents any possible error from user authentication server operations.
 */
export type UserAuthServerError =
	| UserAuthServerDependenciesError
	| UserAuthServerInputError
	| UserAuthServerApiError
	| UserAuthServerDataMissingError
	| UserAuthServerSessionError;

/**
 * Maps Better Auth API errors to UserAuthServerApiError.
 *
 * @pure
 * @description Converts Better Auth APIError instances and other errors to
 * the standardized UserAuthServerApiError format, preserving HTTP status codes.
 *
 * @param error - The original error from Better Auth API
 * @returns UserAuthServerError with appropriate error type
 */
export const mapBetterAuthApiErrorToUserAuthError = (error: unknown): UserAuthServerError => {
	if (error instanceof APIError) {
		const status = typeof error.status === 'number' ? error.status : parseInt(error.status as string, 10) || undefined;

		return new UserAuthServerApiError(error.message, status, error);
	}

	const message = error instanceof Error ? error.message : 'Unknown auth server error';

	return new UserAuthServerApiError(message, undefined, error);
};

/**
 * Input validation error source types for traceability.
 *
 * @pure
 * @description Enables tracing of where the input validation error originated in the workflow.
 */
export type UserInputErrorSource = 'schema_creation' | 'schema_parsing' | 'type_guard_validation' | 'field_validation';

/**
 * Detailed input validation error with source tracing.
 *
 * @pure
 * @description Contains structured information about input validation failures,
 * including the source of the error, field-level details, and the original cause.
 */
export interface UserInputValidationDetails {
	readonly source: UserInputErrorSource;
	readonly operation: string;
	readonly fieldErrors?: ReadonlyArray<{ path: string; message: string }>;
}

/**
 * Maps input validation errors to UserAuthServerInputError with full traceability.
 *
 * @pure
 * @description Converts various input validation error types (ZodError, type guard failures,
 * schema creation errors) into a standardized UserAuthServerInputError with detailed
 * traceability information about where in the workflow the error occurred.
 *
 * @param error - The original error from validation
 * @param source - Where in the workflow the error occurred
 * @param operation - The operation being performed (e.g., 'deleteUser', 'updateUser')
 * @returns UserAuthServerInputError with structured cause for tracing
 */
export const mapBetterAuthInputErrorToUserAuthError = (error: unknown, source: UserInputErrorSource, operation: string): UserAuthServerInputError => {
	const details: UserInputValidationDetails = {
		source,
		operation,
	};

	if (isZodError(error)) {
		const fieldErrors = error.issues.map((issue) => ({
			path: issue.path.join('.'),
			message: issue.message,
		}));

		const detailsWithFields: UserInputValidationDetails = {
			...details,
			fieldErrors,
		};

		const message = formatZodErrorMessage(error, operation);
		return new UserAuthServerInputError(message, { zodError: error, details: detailsWithFields });
	}

	if (error instanceof Error) {
		return new UserAuthServerInputError(error.message, { originalError: error, details });
	}

	const message = `Invalid ${operation} parameters: ${source} failed`;
	return new UserAuthServerInputError(message, { originalError: error, details });
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
 * UserAuthServerInputError with 'schema_creation' source for traceability.
 *
 * @param schemaEffect - The Effect that creates the Zod schema
 * @param operation - The operation name for error context
 * @returns Effect.Effect<ZodSchema, UserAuthServerInputError>
 */
export const createSchemaEffect = <T extends z.ZodType, R = never>(
	schemaEffect: Effect.Effect<T, unknown, R>,
	operation: string
): Effect.Effect<T, UserAuthServerInputError, R> =>
	Effect.catchAll(schemaEffect, (error) => Effect.fail(mapBetterAuthInputErrorToUserAuthError(error, 'schema_creation', operation)));

/**
 * Parses input against a Zod schema and returns an Effect.
 *
 * @pure
 * @description Validates input against the provided schema and wraps the result
 * in an Effect. Failed validation returns a properly traced UserAuthServerInputError.
 *
 * @param schema - The Zod schema to validate against
 * @param input - The input to validate
 * @param operation - The operation name for error context
 * @returns Effect.Effect<T, UserAuthServerInputError> - Validated data or error
 */
export const parseWithSchemaEffect = <T>(schema: z.ZodType<T>, input: unknown, operation: string): Effect.Effect<T, UserAuthServerInputError> =>
	Effect.suspend(() => {
		const result = schema.safeParse(input);

		if (result.success) {
			return Effect.succeed(result.data);
		}

		return Effect.fail(mapBetterAuthInputErrorToUserAuthError(result.error, 'schema_parsing', operation));
	});

/**
 * Validates input with a type guard and returns an Effect.
 *
 * @pure
 * @description Applies a type guard to validated data and returns an Effect.
 * If the type guard fails, returns a traced UserAuthServerInputError.
 *
 * @param data - The data to validate
 * @param typeGuard - The type guard function
 * @param operation - The operation name for error context
 * @returns Effect.Effect<T, UserAuthServerInputError> - Type-narrowed data or error
 */
export const validateWithTypeGuardEffect = <T>(
	data: unknown,
	typeGuard: (value: unknown) => value is T,
	operation: string
): Effect.Effect<T, UserAuthServerInputError> =>
	Effect.suspend(() => {
		if (typeGuard(data)) {
			return Effect.succeed(data);
		}

		const error = new Error('Data does not conform to expected structure');
		return Effect.fail(mapBetterAuthInputErrorToUserAuthError(error, 'type_guard_validation', operation));
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
 *
 * @param schemaEffect - Effect that creates the Zod schema
 * @param input - The input to validate
 * @param typeGuard - Type guard to apply after schema validation
 * @param operation - Operation name for error context
 * @returns Effect.Effect<T, UserAuthServerInputError, R> - Fully validated data or traced error
 */
export const validateInputEffect = <T, R>(
	schemaEffect: Effect.Effect<z.ZodType, unknown, R>,
	input: unknown,
	typeGuard: (value: unknown) => value is T,
	operation: string
): Effect.Effect<T, UserAuthServerInputError, R> =>
	Effect.gen(function* () {
		const schema = yield* createSchemaEffect(schemaEffect, operation);
		const parsed = yield* parseWithSchemaEffect(schema, input, operation);
		const validated = yield* validateWithTypeGuardEffect(parsed, typeGuard, operation);
		return validated;
	});

/**
 * Describes a user authentication error with structured metadata.
 *
 * @pure
 * @description Converts user auth errors to a standardized error descriptor
 * that can be used for logging, monitoring, or API responses.
 *
 * @param error - The user auth error to describe
 * @returns AuthServerErrorDescriptor with appropriate category, code, and status
 */
export const describeUserAuthError = (error: UserAuthServerError): AuthServerErrorDescriptor => {
	switch (error._tag) {
		case 'UserAuthServerInputError':
			return {
				_tag: 'AuthErrorDescriptor',
				category: 'input',
				code: 'invalid_input',
				message: error.message,
				cause: error.cause,
				status: 400,
			};

		case 'UserAuthServerApiError': {
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
			if (error.status === 404) {
				return {
					_tag: 'AuthErrorDescriptor',
					category: 'server',
					code: 'user_not_found',
					message: error.message,
					status: 404,
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

		case 'UserAuthServerSessionError':
			return {
				_tag: 'AuthErrorDescriptor',
				category: 'unauthorized',
				code: 'session_error',
				message: error.message,
				status: 401,
				cause: error.cause,
			};

		case 'UserAuthServerDependenciesError':
			return {
				_tag: 'AuthErrorDescriptor',
				category: 'dependency',
				code: 'dependency_error',
				message: error.message,
				status: 500,
				cause: error.cause,
			};

		case 'UserAuthServerDataMissingError':
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
