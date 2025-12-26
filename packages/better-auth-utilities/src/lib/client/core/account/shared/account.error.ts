/**
 * Error thrown when account dependencies validation fails.
 *
 * @description Indicates that the provided dependencies bundle does not satisfy
 * the contract. This typically occurs when the auth client is missing.
 */
export class AccountAuthDependenciesError extends Error {
  readonly _tag = "AccountAuthDependenciesError";
  override readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "AccountAuthDependenciesError";
    this.cause = cause;
  }
}

/**
 * Error thrown when account input validation fails.
 *
 * @description Indicates that the provided input payload does not satisfy the
 * expected schema for the account operation.
 */
export class AccountAuthInputError extends Error {
  readonly _tag = "AccountAuthInputError";
  override readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "AccountAuthInputError";
    this.cause = cause;
  }
}

/**
 * Error thrown when Better Auth API call fails for account operations.
 *
 * @description Indicates that a Better Auth API request failed with an error response.
 * The `status` property contains the HTTP status code when available.
 */
export class AccountAuthApiError extends Error {
  readonly _tag = "AccountAuthApiError";
  override readonly cause?: unknown;

  constructor(
    message: string,
    public readonly status?: number,
    cause?: unknown,
  ) {
    super(message);
    this.name = "AccountAuthApiError";
    this.cause = cause;
  }
}

/**
 * Error thrown when required data is missing from Better Auth response.
 *
 * @description Indicates that a Better Auth API response succeeded but lacks
 * expected data fields.
 */
export class AccountAuthDataMissingError extends Error {
  readonly _tag = "AccountAuthDataMissingError";
  override readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "AccountAuthDataMissingError";
    this.cause = cause;
  }
}

/**
 * Union type representing all account authentication errors.
 *
 * @description Discriminated union of all possible error types that can occur
 * during account operations.
 */
export type AccountAuthError =
  | AccountAuthDependenciesError
  | AccountAuthInputError
  | AccountAuthApiError
  | AccountAuthDataMissingError;
