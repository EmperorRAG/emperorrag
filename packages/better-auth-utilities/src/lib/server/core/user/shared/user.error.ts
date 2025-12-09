/**
 * @file libs/better-auth-utilities/src/lib/core/user/server/shared/user.error.ts
 * @description Server-side error types for user authentication operations.
 */

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
