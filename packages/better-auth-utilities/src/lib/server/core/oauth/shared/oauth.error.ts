/**
 * @file libs/better-auth-utilities/src/lib/server/core/oauth/shared/oauth.error.ts
 * @description Server-side error types for OAuth authentication operations.
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
 * throw new OAuthAuthServerDependenciesError(
 *   'authServer is required',
 *   { provided: undefined }
 * );
 * ```
 */
export class OAuthAuthServerDependenciesError extends Error {
	readonly _tag = 'OAuthAuthServerDependenciesError' as const;
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'OAuthAuthServerDependenciesError';
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
 * throw new OAuthAuthServerInputError(
 *   'Invalid provider format',
 *   { provider: '' }
 * );
 * ```
 */
export class OAuthAuthServerInputError extends Error {
	readonly _tag = 'OAuthAuthServerInputError' as const;
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'OAuthAuthServerInputError';
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
 *   await authServer.api.signInSocial({ body: { provider: 'google' } });
 * } catch (error) {
 *   if (error instanceof APIError) {
 *     throw new OAuthAuthServerApiError(error.message, error.status, error);
 *   }
 * }
 * ```
 */
export class OAuthAuthServerApiError extends Error {
	readonly _tag = 'OAuthAuthServerApiError' as const;
	override readonly cause?: unknown;

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
 * Error thrown when required data is missing from server response.
 *
 * @pure
 * @description Indicates that the Better Auth server API returned a response
 * but essential data (redirect URL, session, etc.) is missing or malformed.
 *
 * @example
 * ```typescript
 * const result = await authServer.api.signInSocial(params);
 * if (!result.url) {
 *   throw new OAuthAuthServerDataMissingError(
 *     'Redirect URL missing from sign-in response',
 *     result
 *   );
 * }
 * ```
 */
export class OAuthAuthServerDataMissingError extends Error {
	readonly _tag = 'OAuthAuthServerDataMissingError' as const;
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'OAuthAuthServerDataMissingError';
		this.cause = cause;
	}
}

/**
 * Error thrown when session operations fail on server.
 *
 * @pure
 * @description Indicates failures in session creation, retrieval, or validation
 * during server-side OAuth authentication operations.
 *
 * @example
 * ```typescript
 * const session = await authServer.api.getSession({ headers });
 * if (!session) {
 *   throw new OAuthAuthServerSessionError(
 *     'Failed to retrieve session after OAuth sign-in',
 *     { headers }
 *   );
 * }
 * ```
 */
export class OAuthAuthServerSessionError extends Error {
	readonly _tag = 'OAuthAuthServerSessionError' as const;
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'OAuthAuthServerSessionError';
		this.cause = cause;
	}
}

/**
 * Discriminated union of all server-side OAuth authentication errors.
 *
 * @pure
 * @description Enables type-safe error handling using Effect-TS Match.tag() pattern.
 * The _tag property allows pattern matching on error types without instanceof checks.
 *
 * @example
 * ```typescript
 * import { Match } from 'effect';
 *
 * const handleError = (error: OAuthAuthServerError) =>
 *   Match.tag(error, {
 *     OAuthAuthServerDependenciesError: (e) => console.error('Deps error:', e.message),
 *     OAuthAuthServerInputError: (e) => console.error('Input error:', e.message),
 *     OAuthAuthServerApiError: (e) => console.error('API error:', e.message, e.status),
 *     OAuthAuthServerDataMissingError: (e) => console.error('Data missing:', e.message),
 *     OAuthAuthServerSessionError: (e) => console.error('Session error:', e.message),
 *   });
 * ```
 */
export type OAuthAuthServerError =
	| OAuthAuthServerDependenciesError
	| OAuthAuthServerInputError
	| OAuthAuthServerApiError
	| OAuthAuthServerDataMissingError
	| OAuthAuthServerSessionError;
