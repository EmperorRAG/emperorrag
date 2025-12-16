/**
 * Error thrown when OAuth dependencies validation fails.
 *
 * @description Indicates that the provided dependencies bundle does not satisfy
 * the contract. This typically occurs when the auth client is missing.
 */
export class OAuthAuthDependenciesError extends Error {
  readonly _tag = "OAuthAuthDependenciesError";
  override readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "OAuthAuthDependenciesError";
    this.cause = cause;
  }
}

/**
 * Error thrown when OAuth input validation fails.
 *
 * @description Indicates that the provided input payload does not satisfy the
 * expected schema for the OAuth operation.
 */
export class OAuthAuthInputError extends Error {
  readonly _tag = "OAuthAuthInputError";
  override readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "OAuthAuthInputError";
    this.cause = cause;
  }
}

/**
 * Error thrown when Better Auth API call fails for OAuth operations.
 *
 * @description Indicates that a Better Auth API request failed with an error response.
 * The `status` property contains the HTTP status code when available.
 */
export class OAuthAuthApiError extends Error {
  readonly _tag = "OAuthAuthApiError";
  override readonly cause?: unknown;

  constructor(
    message: string,
    public readonly status?: number,
    cause?: unknown,
  ) {
    super(message);
    this.name = "OAuthAuthApiError";
    this.cause = cause;
  }
}

/**
 * Error thrown when required data is missing from Better Auth response.
 *
 * @description Indicates that a Better Auth API response succeeded but lacks
 * expected data fields.
 */
export class OAuthAuthDataMissingError extends Error {
  readonly _tag = "OAuthAuthDataMissingError";
  override readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "OAuthAuthDataMissingError";
    this.cause = cause;
  }
}

/**
 * Union type representing all OAuth authentication errors.
 *
 * @description Discriminated union of all possible error types that can occur
 * during OAuth operations.
 */
export type OAuthAuthError =
  | OAuthAuthDependenciesError
  | OAuthAuthInputError
  | OAuthAuthApiError
  | OAuthAuthDataMissingError;
