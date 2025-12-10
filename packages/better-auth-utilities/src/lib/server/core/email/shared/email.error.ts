/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/shared/email.error.ts
 * @description Server-side error types for email authentication operations.
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
 *
 * @example
 * ```typescript
 * throw new EmailAuthServerDependenciesError(
 *   'authServer is required',
 *   { provided: undefined }
 * );
 * ```
 */
export class EmailAuthServerDependenciesError extends Error {
	readonly _tag = 'EmailAuthServerDependenciesError' as const;
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'EmailAuthServerDependenciesError';
		this.cause = cause;
	}
}

/**
 * Error thrown when server input validation fails.
 *
 * @pure
 * @description Indicates that the provided operation parameters (body, headers, etc.)
 * failed validation. This error occurs during the second stage of validation in the controller layer.
 *
 * @example
 * ```typescript
 * throw new EmailAuthServerInputError(
 *   'Invalid email format',
 *   { email: 'not-an-email' }
 * );
 * ```
 */
export class EmailAuthServerInputError extends Error {
	readonly _tag = 'EmailAuthServerInputError' as const;
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'EmailAuthServerInputError';
		this.cause = cause;
	}
}

/**
 * Error thrown when Better Auth server API call fails.
 *
 * @pure
 * @description Wraps errors from auth.api.* method calls, including Better Auth APIError instances.
 * Preserves HTTP status codes when available for proper error handling and response mapping.
 *
 * @example
 * ```typescript
 * import { APIError } from 'better-auth/api';
 *
 * try {
 *   await authServer.api.signInEmail({ body: { email, password } });
 * } catch (error) {
 *   if (error instanceof APIError) {
 *     throw new EmailAuthServerApiError(error.message, error.status, error);
 *   }
 * }
 * ```
 */
export class EmailAuthServerApiError extends Error {
	readonly _tag = 'EmailAuthServerApiError' as const;
	override readonly cause?: unknown;

	constructor(
		message: string,
		public readonly status?: number,
		cause?: unknown
	) {
		super(message);
		this.name = 'EmailAuthServerApiError';
		this.cause = cause;
	}
}

/**
 * Error thrown when required data is missing from server response.
 *
 * @pure
 * @description Indicates that the Better Auth server API returned a response
 * but essential data (user, session, etc.) is missing or malformed.
 *
 * @example
 * ```typescript
 * const result = await authServer.api.signInEmail(params);
 * if (!result.user) {
 *   throw new EmailAuthServerDataMissingError(
 *     'User data missing from sign-in response',
 *     result
 *   );
 * }
 * ```
 */
export class EmailAuthServerDataMissingError extends Error {
	readonly _tag = 'EmailAuthServerDataMissingError' as const;
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'EmailAuthServerDataMissingError';
		this.cause = cause;
	}
}

/**
 * Error thrown when session operations fail on server.
 *
 * @pure
 * @description Indicates failures in session creation, retrieval, or validation
 * during server-side email authentication operations.
 *
 * @example
 * ```typescript
 * const session = await authServer.api.getSession({ headers });
 * if (!session) {
 *   throw new EmailAuthServerSessionError(
 *     'Failed to retrieve session after sign-in',
 *     { headers }
 *   );
 * }
 * ```
 */
export class EmailAuthServerSessionError extends Error {
	readonly _tag = 'EmailAuthServerSessionError' as const;
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'EmailAuthServerSessionError';
		this.cause = cause;
	}
}

/**
 * Discriminated union of all server-side email authentication errors.
 *
 * @pure
 * @description Enables type-safe error handling using Effect-TS Match.tag() pattern.
 * The _tag property allows pattern matching on error types without instanceof checks.
 *
 * @example
 * ```typescript
 * import { Match } from 'effect';
 *
 * const handleError = (error: EmailAuthServerError) =>
 *   Match.tag(error, {
 *     EmailAuthServerDependenciesError: (e) => console.error('Deps error:', e.message),
 *     EmailAuthServerInputError: (e) => console.error('Input error:', e.message),
 *     EmailAuthServerApiError: (e) => console.error('API error:', e.message, e.status),
 *     EmailAuthServerDataMissingError: (e) => console.error('Data missing:', e.message),
 *     EmailAuthServerSessionError: (e) => console.error('Session error:', e.message),
 *   });
 * ```
 */
export type EmailAuthServerError =
	| EmailAuthServerDependenciesError
	| EmailAuthServerInputError
	| EmailAuthServerApiError
	| EmailAuthServerDataMissingError
	| EmailAuthServerSessionError;

export const mapBetterAuthApiErrorToEmailAuthError = (error: unknown): EmailAuthServerError => {
	if (error instanceof APIError) {
		const status = typeof error.status === 'number' ? error.status : parseInt(error.status as string, 10) || undefined;

		return new EmailAuthServerApiError(error.message, status, error);
	}

	const message = error instanceof Error ? error.message : 'Unknown auth server error';

	// you *could* also route this to a more generic deps error, etc.
	return new EmailAuthServerApiError(message, undefined, error);
};

/**
 * Input validation error source types for traceability.
 *
 * @pure
 * @description Enables tracing of where the input validation error originated in the workflow.
 */
export type EmailInputErrorSource = 'schema_creation' | 'schema_parsing' | 'type_guard_validation' | 'field_validation';

/**
 * Detailed input validation error with source tracing.
 *
 * @pure
 * @description Contains structured information about input validation failures,
 * including the source of the error, field-level details, and the original cause.
 */
export interface EmailInputValidationDetails {
	readonly source: EmailInputErrorSource;
	readonly operation: string;
	readonly fieldErrors?: ReadonlyArray<{ path: string; message: string }>;
}

/**
 * Maps input validation errors to EmailAuthServerInputError with full traceability.
 *
 * @pure
 * @description Converts various input validation error types (ZodError, type guard failures,
 * schema creation errors) into a standardized EmailAuthServerInputError with detailed
 * traceability information about where in the workflow the error occurred.
 *
 * @param error - The original error from validation
 * @param source - Where in the workflow the error occurred
 * @param operation - The operation being performed (e.g., 'signUpEmail', 'signInEmail')
 * @returns EmailAuthServerInputError with structured cause for tracing
 */
export const mapBetterAuthInputErrorToEmailAuthError = (error: unknown, source: EmailInputErrorSource, operation: string): EmailAuthServerInputError => {
	const details: EmailInputValidationDetails = {
		source,
		operation,
	};

	if (isZodError(error)) {
		const fieldErrors = error.issues.map((issue) => ({
			path: issue.path.join('.'),
			message: issue.message,
		}));

		const detailsWithFields: EmailInputValidationDetails = {
			...details,
			fieldErrors,
		};

		const message = formatZodErrorMessage(error, operation);
		return new EmailAuthServerInputError(message, { zodError: error, details: detailsWithFields });
	}

	if (error instanceof Error) {
		return new EmailAuthServerInputError(error.message, { originalError: error, details });
	}

	const message = `Invalid ${operation} parameters: ${source} failed`;
	return new EmailAuthServerInputError(message, { originalError: error, details });
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
 * EmailAuthServerInputError with 'schema_creation' source for traceability.
 *
 * @param schemaEffect - The Effect that creates the Zod schema
 * @param operation - The operation name for error context
 * @returns Effect.Effect<ZodSchema, EmailAuthServerInputError>
 */
export const createSchemaEffect = <T extends z.ZodType, R = never>(
	schemaEffect: Effect.Effect<T, unknown, R>,
	operation: string
): Effect.Effect<T, EmailAuthServerInputError, R> =>
	Effect.catchAll(schemaEffect, (error) => Effect.fail(mapBetterAuthInputErrorToEmailAuthError(error, 'schema_creation', operation)));

/**
 * Parses input against a Zod schema and returns an Effect.
 *
 * @pure
 * @description Validates input against the provided schema and wraps the result
 * in an Effect. Failed validation returns a properly traced EmailAuthServerInputError.
 *
 * @param schema - The Zod schema to validate against
 * @param input - The input to validate
 * @param operation - The operation name for error context
 * @returns Effect.Effect<T, EmailAuthServerInputError> - Validated data or error
 */
export const parseWithSchemaEffect = <T>(schema: z.ZodType<T>, input: unknown, operation: string): Effect.Effect<T, EmailAuthServerInputError> =>
	Effect.suspend(() => {
		const result = schema.safeParse(input);

		if (result.success) {
			return Effect.succeed(result.data);
		}

		return Effect.fail(mapBetterAuthInputErrorToEmailAuthError(result.error, 'schema_parsing', operation));
	});

/**
 * Validates input with a type guard and returns an Effect.
 *
 * @pure
 * @description Applies a type guard to validated data and returns an Effect.
 * If the type guard fails, returns a traced EmailAuthServerInputError.
 *
 * @param data - The data to validate
 * @param typeGuard - The type guard function
 * @param operation - The operation name for error context
 * @returns Effect.Effect<T, EmailAuthServerInputError> - Type-narrowed data or error
 */
export const validateWithTypeGuardEffect = <T>(
	data: unknown,
	typeGuard: (value: unknown) => value is T,
	operation: string
): Effect.Effect<T, EmailAuthServerInputError> =>
	Effect.suspend(() => {
		if (typeGuard(data)) {
			return Effect.succeed(data);
		}

		const error = new Error('Data does not conform to expected structure');
		return Effect.fail(mapBetterAuthInputErrorToEmailAuthError(error, 'type_guard_validation', operation));
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
 * @returns Effect.Effect<T, EmailAuthServerInputError, R> - Fully validated data or traced error
 */
export const validateInputEffect = <T, R>(
	schemaEffect: Effect.Effect<z.ZodType, unknown, R>,
	input: unknown,
	typeGuard: (value: unknown) => value is T,
	operation: string
): Effect.Effect<T, EmailAuthServerInputError, R> =>
	Effect.gen(function* () {
		const schema = yield* createSchemaEffect(schemaEffect, operation);
		const parsed = yield* parseWithSchemaEffect(schema, input, operation);
		const validated = yield* validateWithTypeGuardEffect(parsed, typeGuard, operation);
		return validated;
	});

export const describeEmailAuthError = (error: EmailAuthServerError): AuthServerErrorDescriptor => {
	// Tagged classes make this easy
	switch (error._tag) {
		case 'EmailAuthServerInputError':
			return {
				_tag: 'AuthErrorDescriptor',
				category: 'input',
				code: 'invalid_input',
				message: error.message,
				cause: error.cause,
				status: 400,
			};

		case 'EmailAuthServerApiError': {
			// You can specialize based on status
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

		case 'EmailAuthServerSessionError':
			return {
				_tag: 'AuthErrorDescriptor',
				category: 'unauthorized',
				code: 'session_error',
				message: error.message,
				status: 401,
				cause: error.cause,
			};

		case 'EmailAuthServerDependenciesError':
			return {
				_tag: 'AuthErrorDescriptor',
				category: 'dependency',
				code: 'dependency_error',
				message: error.message,
				status: 500,
				cause: error.cause,
			};

		case 'EmailAuthServerDataMissingError':
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
