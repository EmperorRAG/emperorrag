/**
 * Error thrown when account authentication dependencies validation fails.
 *
 * @description Indicates that the provided dependencies bundle does not satisfy
 * the `AccountAuthServerDeps` contract. This typically occurs when the auth server
 * is missing or required adapters have incorrect shapes.
 */
export class AccountAuthServerDependenciesError extends Error {
	readonly _tag = 'AccountAuthServerDependenciesError';
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'AccountAuthServerDependenciesError';
		this.cause = cause;
	}
}

/**
 * Error thrown when account authentication input validation fails.
 *
 * @description Indicates that the provided input payload does not satisfy the
 * expected schema for the account operation.
 * This typically occurs when required fields are missing or have invalid formats.
 */
export class AccountAuthServerInputError extends Error {
	readonly _tag = 'AccountAuthServerInputError';
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'AccountAuthServerInputError';
		this.cause = cause;
	}
}

/**
 * Error thrown when Better Auth API call fails.
 *
 * @description Indicates that a Better Auth API request failed with an error response.
 * The `status` property contains the HTTP status code when available.
 */
export class AccountAuthServerApiError extends Error {
	readonly _tag = 'AccountAuthServerApiError';
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
 * Error thrown when required data is missing from Better Auth response.
 *
 * @description Indicates that a Better Auth API response succeeded but lacks
 * expected data fields.
 */
export class AccountAuthServerDataMissingError extends Error {
	readonly _tag = 'AccountAuthServerDataMissingError';
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
 * @description Indicates that session retrieval or validation failed during
 * an account operation.
 */
export class AccountAuthServerSessionError extends Error {
	readonly _tag = 'AccountAuthServerSessionError';
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
 * @description Discriminated union of all possible error types that can occur
 * during account authentication operations.
 */
export type AccountAuthServerError =
	| AccountAuthServerDependenciesError
	| AccountAuthServerInputError
	| AccountAuthServerApiError
	| AccountAuthServerDataMissingError
	| AccountAuthServerSessionError;
