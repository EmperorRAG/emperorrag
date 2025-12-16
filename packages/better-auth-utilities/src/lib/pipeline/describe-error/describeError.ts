import { pipe } from "effect/Function";
import * as Match from "effect/Match";
import { AuthServerApiError, type AuthServerError } from "../../errors/authServer.error";
import { createAuthServerAuthServerErrorDescriptor } from "../create-auth-server-auth-server-error-descriptor/createAuthServerAuthServerErrorDescriptor";
import { createAuthServerDataMissingErrorDescriptor } from "../create-auth-server-data-missing-error-descriptor/createAuthServerDataMissingErrorDescriptor";
import { createAuthServerDependencyErrorDescriptor } from "../create-auth-server-dependency-error-descriptor/createAuthServerDependencyErrorDescriptor";
import { createAuthServerInvalidCredentialsErrorDescriptor } from "../create-auth-server-invalid-credentials-error-descriptor/createAuthServerInvalidCredentialsErrorDescriptor";
import { createAuthServerInvalidInputErrorDescriptor } from "../create-auth-server-invalid-input-error-descriptor/createAuthServerInvalidInputErrorDescriptor";
import { createAuthServerSessionErrorDescriptor } from "../create-auth-server-session-error-descriptor/createAuthServerSessionErrorDescriptor";
import { createAuthServerUserAlreadyExistsErrorDescriptor } from "../create-auth-server-user-already-exists-error-descriptor/createAuthServerUserAlreadyExistsErrorDescriptor";
import type { AuthServerErrorDescriptor } from "./describeError.types";

export const describeError = (
  error: AuthServerError,
): AuthServerErrorDescriptor =>
  pipe(
    Match.value(error),
    Match.tag(
      "AuthServerInputError",
      createAuthServerInvalidInputErrorDescriptor,
    ),
    Match.tag("AuthServerApiError", (err) => {
      if (err.status === 401) {
        return createAuthServerInvalidCredentialsErrorDescriptor(err);
      }
      if (err.status === 409) {
        return createAuthServerUserAlreadyExistsErrorDescriptor(err);
      }
      return createAuthServerAuthServerErrorDescriptor(err);
    }),
    Match.tag("AuthServerSessionError", createAuthServerSessionErrorDescriptor),
    Match.tag(
      "AuthServerDependenciesError",
      createAuthServerDependencyErrorDescriptor,
    ),
    Match.tag(
      "AuthServerDataMissingError",
      createAuthServerDataMissingErrorDescriptor,
    ),
    Match.exhaustive,
  );

/**
 * Helper to create a generic 500 error descriptor for unknown errors.
 */
export const createUnknownErrorDescriptor = (
  cause: unknown,
): AuthServerErrorDescriptor => {
  const error = new AuthServerApiError({
    message: "An unexpected error occurred",
    status: 500,
    cause,
  });
  return {
    _tag: "AuthServerErrorDescriptor",
    authServerErrorType: error,
    code: "auth_server_error",
    message: error.message,
    status: 500,
    cause,
  };
};
