/**
 * Error thrown when session dependencies validation fails.
 *
 * @description Indicates that the provided dependencies bundle does not satisfy
 * the contract. This typically occurs when the auth client is missing.
 */
export class SessionAuthDependenciesError extends Error {
  readonly _tag = "SessionAuthDependenciesError";
  override readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "SessionAuthDependenciesError";
    this.cause = cause;
  }
}

/**
 * Error thrown when session input validation fails.
 *
 * @description Indicates that the provided input payload does not satisfy the
 * expected schema for the session operation.
 */
export class SessionAuthInputError extends Error {
  readonly _tag = "SessionAuthInputError";
  override readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "SessionAuthInputError";
    this.cause = cause;
  }
}

/**
 * Error thrown when Better Auth API call fails for session operations.
 *
 * @description Indicates that a Better Auth API request failed with an error response.
 * The `status` property contains the HTTP status code when available.
 */
export class SessionAuthApiError extends Error {
  readonly _tag = "SessionAuthApiError";
  override readonly cause?: unknown;

  constructor(
    message: string,
    public readonly status?: number,
    cause?: unknown,
  ) {
    super(message);
    this.name = "SessionAuthApiError";
    this.cause = cause;
  }
}

/**
 * Error thrown when required data is missing from Better Auth response.
 *
 * @description Indicates that a Better Auth API response succeeded but lacks
 * expected data fields.
 */
export class SessionAuthDataMissingError extends Error {
  readonly _tag = "SessionAuthDataMissingError";
  override readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "SessionAuthDataMissingError";
    this.cause = cause;
  }
}

/**
 * Union type representing all session authentication errors.
 *
 * @description Discriminated union of all possible error types that can occur
 * during session operations.
 */
export type SessionAuthError =
  | SessionAuthDependenciesError
  | SessionAuthInputError
  | SessionAuthApiError
  | SessionAuthDataMissingError;
