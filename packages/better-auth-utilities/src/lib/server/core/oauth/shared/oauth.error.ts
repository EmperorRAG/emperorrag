/**
 * @file libs/better-auth-utilities/src/lib/core/oauth/server/shared/oauth.error.ts
 * @description Error definitions for OAuth server operations.
 */

/**
 * Error thrown when an OAuth server API operation fails.
 * Wraps the underlying error from Better Auth or network failures.
 */
export class OAuthAuthServerApiError extends Error {
	readonly _tag = 'OAuthAuthServerApiError';
	constructor(
		message: string,
		public readonly status?: number,
		cause?: unknown
	) {
		super(message);
		this.name = 'OAuthAuthServerApiError';
		this.cause = cause;
	}
}

/**
 * Error thrown when input validation fails for OAuth server operations.
 */
export class OAuthAuthServerInputError extends Error {
	readonly _tag = 'OAuthAuthServerInputError';
	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'OAuthAuthServerInputError';
		this.cause = cause;
	}
}

/**
 * Discriminated union of all possible OAuth server errors.
 * Use this type in Effect error channels.
 */
export type OAuthAuthServerError = OAuthAuthServerApiError | OAuthAuthServerInputError;
