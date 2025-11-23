/**
 * Error thrown when user authentication dependencies validation fails (Server).
 *
 * @description Indicates that the provided dependencies bundle does not satisfy
 * the `UserAuthServerDeps` contract. This typically occurs when the auth server
 * is missing or required adapters have incorrect shapes.
 */
export class UserAuthServerDependenciesError extends Error {
	readonly _tag = 'UserAuthServerDependenciesError';
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'UserAuthServerDependenciesError';
		this.cause = cause;
	}
}

/**
 * Error thrown when user authentication input validation fails (Server).
 *
 * @description Indicates that the provided input payload does not satisfy the
 * expected schema for the user operation.
 * This typically occurs when required fields are missing or have invalid formats.
 */
export class UserAuthServerInputError extends Error {
	readonly _tag = 'UserAuthServerInputError';
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'UserAuthServerInputError';
		this.cause = cause;
	}
}

/**
 * Error thrown when Better Auth API call fails (Server).
 *
 * @description Indicates that a Better Auth API request failed with an error response.
 * The `status` property contains the HTTP status code when available.
 */
export class UserAuthServerApiError extends Error {
	readonly _tag = 'UserAuthServerApiError';
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
 * Error thrown when required data is missing from Better Auth response (Server).
 *
 * @description Indicates that a Better Auth API response succeeded but lacks
 * expected data fields.
 */
export class UserAuthServerDataMissingError extends Error {
	readonly _tag = 'UserAuthServerDataMissingError';
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'UserAuthServerDataMissingError';
		this.cause = cause;
	}
}

/**
 * Union type representing all user authentication errors (Server).
 *
 * @description Discriminated union of all possible error types that can occur
 * during user authentication operations.
 */
export type UserAuthServerError = UserAuthServerDependenciesError | UserAuthServerInputError | UserAuthServerApiError | UserAuthServerDataMissingError;
