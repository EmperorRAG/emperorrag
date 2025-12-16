/**
 * Error thrown when user dependencies validation fails.
 *
 * @description Indicates that the provided dependencies bundle does not satisfy
 * the contract. This typically occurs when the auth client is missing.
 */
export class UserAuthDependenciesError extends Error {
  readonly _tag = "UserAuthDependenciesError";
  override readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "UserAuthDependenciesError";
    this.cause = cause;
  }
}

/**
 * Error thrown when user input validation fails.
 *
 * @description Indicates that the provided input payload does not satisfy the
 * expected schema for the user operation.
 */
export class UserAuthInputError extends Error {
  readonly _tag = "UserAuthInputError";
  override readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "UserAuthInputError";
    this.cause = cause;
  }
}

/**
 * Error thrown when Better Auth API call fails for user operations.
 *
 * @description Indicates that a Better Auth API request failed with an error response.
 * The `status` property contains the HTTP status code when available.
 */
export class UserAuthApiError extends Error {
  readonly _tag = "UserAuthApiError";
  override readonly cause?: unknown;

  constructor(
    message: string,
    public readonly status?: number,
    cause?: unknown,
  ) {
    super(message);
    this.name = "UserAuthApiError";
    this.cause = cause;
  }
}

/**
 * Error thrown when required data is missing from Better Auth response.
 *
 * @description Indicates that a Better Auth API response succeeded but lacks
 * expected data fields.
 */
export class UserAuthDataMissingError extends Error {
  readonly _tag = "UserAuthDataMissingError";
  override readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "UserAuthDataMissingError";
    this.cause = cause;
  }
}

/**
 * Union type representing all user authentication errors.
 *
 * @description Discriminated union of all possible error types that can occur
 * during user operations.
 */
export type UserAuthError =
  | UserAuthDependenciesError
  | UserAuthInputError
  | UserAuthApiError
  | UserAuthDataMissingError;
