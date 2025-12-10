/**
 * @file libs/better-auth-utilities/src/lib/core/email/server/shared/email.error.ts
 * @description Server-side error types for email authentication operations.
 */

import type { AuthServerErrorDescriptor } from '../../../server.types';
import { APIError } from 'better-auth';

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
