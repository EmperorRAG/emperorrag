/**
 * @file libs/better-auth-utilities/src/lib/errors/authServer.error.ts
 * @description Centralized server-side error types and validation utilities for core authentication operations.
 */

import * as Data from "effect/Data";
import type { AuthServerApiEndpointKeyFor, AuthServerApiFor, AuthServerFor } from "../server/server.types";

/**
 * Error thrown when server dependencies validation fails.
 *
 * @pure
 * @description Indicates that the provided authServer dependency is invalid or missing.
 * This error occurs during the first stage of validation in the controller layer.
 */
export class AuthServerDependenciesError extends Data.TaggedError(
  "AuthServerDependenciesError",
)<{
  message: string;
  cause?: unknown;
}> {}

/**
 * Error thrown when server input validation fails.
 *
 * @pure
 * @description Indicates that the provided operation parameters (body, headers, etc.)
 * failed validation. This error occurs during the second stage of validation in the controller layer.
 */
export class AuthServerInputError extends Data.TaggedError(
  "AuthServerInputError",
)<{
  message: string;
  cause?: unknown;
}> {}

/**
 * Error thrown when Better Auth server API call fails.
 *
 * @pure
 * @description Wraps errors from auth.api.* method calls, including Better Auth APIError instances.
 * Preserves HTTP status codes when available for proper error handling and response mapping.
 */
export class AuthServerApiError extends Data.TaggedError("AuthServerApiError")<{
  message: string;
  status?: number;
  cause?: unknown;
}> {}

/**
 * Error thrown when required data is missing from server response.
 *
 * @pure
 * @description Indicates that the Better Auth server API returned a response
 * but essential data (user, session, etc.) is missing or malformed.
 */
export class AuthServerDataMissingError extends Data.TaggedError(
  "AuthServerDataMissingError",
)<{
  message: string;
  cause?: unknown;
}> {}

/**
 * Error thrown when session operations fail on server.
 *
 * @pure
 * @description Indicates failures in session creation, retrieval, or validation
 * during server-side authentication operations.
 */
export class AuthServerSessionError extends Data.TaggedError(
  "AuthServerSessionError",
)<{
  message: string;
  cause?: unknown;
}> {}

/**
 * Discriminated union of all server-side core authentication errors.
 *
 * @pure
 * @description Enables type-safe error handling using Effect-TS Match.tag() pattern.
 */
export type AuthServerError =
  | AuthServerDependenciesError
  | AuthServerInputError
  | AuthServerApiError
  | AuthServerDataMissingError
  | AuthServerSessionError;

/**
 * Type helper to extract the error endpoint type from an AuthServer.
 *
 * @pure
 * @description Returns the type of the `error` utility method from the server API.
 *
 * @example
 * ```typescript
 * type ErrorMethod = AuthServerErrorFor<typeof authServer>;
 * ```
 */
export type AuthServerErrorFor<T extends AuthServerFor = AuthServerFor> = "error" extends AuthServerApiEndpointKeyFor<T>
  ? AuthServerApiFor<T>["error"]
  : never;
