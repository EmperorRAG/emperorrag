/**
 * @file libs/better-auth-utilities/src/lib/server/core/session/shared/session.error.ts
 * @description Server-side error types for session authentication operations.
 */

/**
 * Error thrown when server dependencies validation fails.
 *
 * @pure
 * @description Indicates that the provided authServer dependency is invalid or missing.
 * This error occurs during the first stage of validation in the controller layer.
 *
 * @example
 * ```typescript
 * throw new SessionAuthServerDependenciesError(
 *   'authServer is required',
 *   { provided: undefined }
 * );
 * ```
 */
export class SessionAuthServerDependenciesError extends Error {
	readonly _tag = 'SessionAuthServerDependenciesError' as const;
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'SessionAuthServerDependenciesError';
		this.cause = cause;
	}
}

/**
 * Error thrown when server input validation fails.
 *
 * @pure
 * @description Indicates that the provided operation parameters (headers, etc.)
 * failed validation. This error occurs during the second stage of validation in the controller layer.
 *
 * @example
 * ```typescript
 * throw new SessionAuthServerInputError(
 *   'Headers are required for session retrieval',
 *   { headers: undefined }
 * );
 * ```
 */
export class SessionAuthServerInputError extends Error {
	readonly _tag = 'SessionAuthServerInputError' as const;
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'SessionAuthServerInputError';
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
 *   await authServer.api.getSession({ headers });
 * } catch (error) {
 *   if (error instanceof APIError) {
 *     throw new SessionAuthServerApiError(error.message, error.status, error);
 *   }
 * }
 * ```
 */
export class SessionAuthServerApiError extends Error {
	readonly _tag = 'SessionAuthServerApiError' as const;
	override readonly cause?: unknown;

	constructor(
		message: string,
		public readonly status?: number,
		cause?: unknown
	) {
		super(message);
		this.name = 'SessionAuthServerApiError';
		this.cause = cause;
	}
}

/**
 * Error thrown when required data is missing from server response.
 *
 * @pure
 * @description Indicates that the Better Auth server API returned a response
 * but essential data (session, user, etc.) is missing or malformed.
 *
 * @example
 * ```typescript
 * const result = await authServer.api.getSession({ headers });
 * if (!result?.session) {
 *   throw new SessionAuthServerDataMissingError(
 *     'Session data missing from response',
 *     result
 *   );
 * }
 * ```
 */
export class SessionAuthServerDataMissingError extends Error {
	readonly _tag = 'SessionAuthServerDataMissingError' as const;
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'SessionAuthServerDataMissingError';
		this.cause = cause;
	}
}

/**
 * Error thrown when session is not found or expired.
 *
 * @pure
 * @description Indicates that no valid session exists for the provided credentials.
 * This is distinct from API errors - it means the API succeeded but the user is not authenticated.
 *
 * @example
 * ```typescript
 * const session = await authServer.api.getSession({ headers });
 * if (session === null) {
 *   throw new SessionAuthServerSessionError(
 *     'No active session found',
 *     { headers }
 *   );
 * }
 * ```
 */
export class SessionAuthServerSessionError extends Error {
	readonly _tag = 'SessionAuthServerSessionError' as const;
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'SessionAuthServerSessionError';
		this.cause = cause;
	}
}

/**
 * Discriminated union of all server-side session authentication errors.
 *
 * @pure
 * @description Enables type-safe error handling using Effect-TS Match.tag() pattern.
 * The _tag property allows pattern matching on error types without instanceof checks.
 *
 * @example
 * ```typescript
 * import { Match } from 'effect';
 *
 * const handleError = (error: SessionAuthServerError) =>
 *   Match.tag(error, {
 *     SessionAuthServerDependenciesError: (e) => console.error('Deps error:', e.message),
 *     SessionAuthServerInputError: (e) => console.error('Input error:', e.message),
 *     SessionAuthServerApiError: (e) => console.error('API error:', e.message, e.status),
 *     SessionAuthServerDataMissingError: (e) => console.error('Data missing:', e.message),
 *     SessionAuthServerSessionError: (e) => console.error('Session error:', e.message),
 *   });
 * ```
 */
export type SessionAuthServerError =
	| SessionAuthServerDependenciesError
	| SessionAuthServerInputError
	| SessionAuthServerApiError
	| SessionAuthServerDataMissingError
	| SessionAuthServerSessionError;
