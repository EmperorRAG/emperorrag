/**
 * @file libs/better-auth-utilities/src/lib/server/core/account/shared/account.error.ts
 * @description Server-side error types for account authentication operations.
 */

/**
 * Error thrown when account server dependencies validation fails.
 *
 * @pure
 * @description Indicates that the provided authServer dependency is invalid or missing.
 * This error occurs during the first stage of validation in the controller layer.
 *
 * @example
 * ```typescript
 * throw new AccountAuthServerDependenciesError(
 *   'authServer is required',
 *   { provided: undefined }
 * );
 * ```
 */
export class AccountAuthServerDependenciesError extends Error {
	readonly _tag = 'AccountAuthServerDependenciesError' as const;
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'AccountAuthServerDependenciesError';
		this.cause = cause;
	}
}

/**
 * Error thrown when account server input validation fails.
 *
 * @pure
 * @description Indicates that the provided operation parameters (body, headers, etc.)
 * failed validation. This error occurs during the second stage of validation in the controller layer.
 *
 * @example
 * ```typescript
 * throw new AccountAuthServerInputError(
 *   'Invalid providerId format',
 *   { providerId: '' }
 * );
 * ```
 */
export class AccountAuthServerInputError extends Error {
	readonly _tag = 'AccountAuthServerInputError' as const;
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'AccountAuthServerInputError';
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
 *   await authServer.api.listAccounts({ headers });
 * } catch (error) {
 *   if (error instanceof APIError) {
 *     throw new AccountAuthServerApiError(error.message, error.status, error);
 *   }
 * }
 * ```
 */
export class AccountAuthServerApiError extends Error {
	readonly _tag = 'AccountAuthServerApiError' as const;
	override readonly cause?: unknown;

	constructor(
		message: string,
		public readonly status?: number,
		cause?: unknown
	) {
		super(message);
		this.name = 'AccountAuthServerApiError';
		this.cause = cause;
	}
}

/**
 * Error thrown when required data is missing from server response.
 *
 * @pure
 * @description Indicates that the Better Auth server API returned a response
 * but essential data (accounts, status, etc.) is missing or malformed.
 *
 * @example
 * ```typescript
 * throw new AccountAuthServerDataMissingError(
 *   'No accounts data returned from API',
 *   { response: result }
 * );
 * ```
 */
export class AccountAuthServerDataMissingError extends Error {
	readonly _tag = 'AccountAuthServerDataMissingError' as const;
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'AccountAuthServerDataMissingError';
		this.cause = cause;
	}
}

/**
 * Error thrown when session resolution fails.
 *
 * @pure
 * @description Indicates that session retrieval or validation failed during
 * an account operation.
 *
 * @example
 * ```typescript
 * throw new AccountAuthServerSessionError(
 *   'Session not found or expired',
 *   { headers: requestHeaders }
 * );
 * ```
 */
export class AccountAuthServerSessionError extends Error {
	readonly _tag = 'AccountAuthServerSessionError' as const;
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'AccountAuthServerSessionError';
		this.cause = cause;
	}
}

/**
 * Union type representing all account authentication errors.
 *
 * @pure
 * @description Discriminated union of all possible error types that can occur
 * during account authentication operations. Use the `_tag` property for type narrowing.
 *
 * @example
 * ```typescript
 * import * as Effect from 'effect/Effect';
 *
 * const handled = Effect.catchTag(program, 'AccountAuthServerApiError', (error) => {
 *   if (error.status === 401) {
 *     return Effect.fail(new Error('Unauthorized'));
 *   }
 *   return Effect.fail(error);
 * });
 * ```
 */
export type AccountAuthServerError =
	| AccountAuthServerDependenciesError
	| AccountAuthServerInputError
	| AccountAuthServerApiError
	| AccountAuthServerDataMissingError
	| AccountAuthServerSessionError;
