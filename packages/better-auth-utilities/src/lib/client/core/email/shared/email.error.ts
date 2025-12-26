/**
 * Error thrown when email authentication dependencies validation fails.
 *
 * @description Indicates that the provided dependencies bundle does not satisfy
 * the `EmailAuthClientDeps` contract. This typically occurs when the auth client
 * is missing or required adapters have incorrect shapes.
 */
export class EmailAuthDependenciesError extends Error {
  readonly _tag = "EmailAuthDependenciesError";
  override readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "EmailAuthDependenciesError";
    this.cause = cause;
  }
}

/**
 * Error thrown when email authentication input validation fails.
 *
 * @description Indicates that the provided input payload does not satisfy the
 * expected schema for the authentication operation (e.g., sign-up, sign-in).
 * This typically occurs when required fields are missing or have invalid formats.
 */
export class EmailAuthInputError extends Error {
  readonly _tag = "EmailAuthInputError";
  override readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "EmailAuthInputError";
    this.cause = cause;
  }
}

/**
 * Error thrown when Better Auth API call fails.
 *
 * @description Indicates that a Better Auth API request failed with an error response.
 * The `status` property contains the HTTP status code when available. Common causes
 * include invalid credentials, rate limiting, or network failures.
 */
export class EmailAuthApiError extends Error {
  readonly _tag = "EmailAuthApiError";
  override readonly cause?: unknown;

  constructor(
    message: string,
    public readonly status?: number,
    cause?: unknown,
  ) {
    super(message);
    this.name = "EmailAuthApiError";
    this.cause = cause;
  }
}

/**
 * Error thrown when required data is missing from Better Auth response.
 *
 * @description Indicates that a Better Auth API response succeeded but lacks
 * expected data fields (e.g., user payload, session). This can occur when the
 * response structure changes or when optional fields are unexpectedly absent.
 */
export class EmailAuthDataMissingError extends Error {
  readonly _tag = "EmailAuthDataMissingError";
  override readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "EmailAuthDataMissingError";
    this.cause = cause;
  }
}

/**
 * Error thrown when session resolution fails.
 *
 * @description Indicates that session retrieval or validation failed during
 * an authentication operation. This can occur when the session token is invalid,
 * expired, or when the session fetch API call fails.
 */
export class EmailAuthSessionError extends Error {
  readonly _tag = "EmailAuthSessionError";
  override readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "EmailAuthSessionError";
    this.cause = cause;
  }
}

/**
 * Union type representing all email authentication errors.
 *
 * @description Discriminated union of all possible error types that can occur
 * during email authentication operations. Each error has a unique `_tag` property
 * that enables type-safe pattern matching and error handling with Effect-TS.
 *
 * @example
 * ```typescript
 * import * as Match from 'effect/Match';
 *
 * const handleError = (error: EmailAuthError): string =>
 *   Match.value(error).pipe(
 *     Match.tag('EmailAuthDependenciesError', () => 'Invalid dependencies'),
 *     Match.tag('EmailAuthInputError', () => 'Invalid input'),
 *     Match.tag('EmailAuthApiError', (e) => `API error: ${e.status}`),
 *     Match.tag('EmailAuthDataMissingError', () => 'Missing data'),
 *     Match.tag('EmailAuthSessionError', () => 'Session error'),
 *     Match.exhaustive
 *   );
 * ```
 */
export type EmailAuthError =
  | EmailAuthDependenciesError
  | EmailAuthInputError
  | EmailAuthApiError
  | EmailAuthDataMissingError
  | EmailAuthSessionError;
