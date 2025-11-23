/**
 * Error thrown when session authentication dependencies validation fails (Server).
 *
 * @description Indicates that the provided dependencies bundle does not satisfy
 * the `SessionAuthServerDeps` contract. This typically occurs when the auth server
 * is missing or required adapters have incorrect shapes.
 */
export class SessionAuthServerDependenciesError extends Error {
	readonly _tag = 'SessionAuthServerDependenciesError';
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'SessionAuthServerDependenciesError';
		this.cause = cause;
	}
}

/**
 * Error thrown when session authentication input validation fails (Server).
 *
 * @description Indicates that the provided input payload does not satisfy the
 * expected schema for the session operation.
 * This typically occurs when required fields are missing or have invalid formats.
 */
export class SessionAuthServerInputError extends Error {
	readonly _tag = 'SessionAuthServerInputError';
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'SessionAuthServerInputError';
		this.cause = cause;
	}
}

/**
 * Error thrown when Better Auth API call fails (Server).
 *
 * @description Indicates that a Better Auth API request failed with an error response.
 * The `status` property contains the HTTP status code when available.
 */
export class SessionAuthServerApiError extends Error {
	readonly _tag = 'SessionAuthServerApiError';
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
 * Error thrown when required data is missing from Better Auth response (Server).
 *
 * @description Indicates that a Better Auth API response succeeded but lacks
 * expected data fields.
 */
export class SessionAuthServerDataMissingError extends Error {
	readonly _tag = 'SessionAuthServerDataMissingError';
	override readonly cause?: unknown;

	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'SessionAuthServerDataMissingError';
		this.cause = cause;
	}
}

/**
 * Union type representing all session authentication errors (Server).
 *
 * @description Discriminated union of all possible error types that can occur
 * during session authentication operations.
 */
export type SessionAuthServerError = SessionAuthServerDependenciesError | SessionAuthServerInputError | SessionAuthServerApiError | SessionAuthServerDataMissingError;
