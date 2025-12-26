import { Effect, Schema } from "effect";
import { pipe } from "effect/Function";
import { changePasswordService } from "./changePassword.service";
import { ChangePasswordServerParams } from "./changePassword.types";

/**
 * Controller for handling change password requests.
 *
 * Acceptance Criteria:
 * 1. Must export a function named `changePasswordController`.
 * 2. Must take an `unknown` input.
 * 3. Must validate the input against the `ChangePasswordServerParams` schema using `Schema.decodeUnknown`.
 * 4. Must delegate processing to `changePasswordService` using `Effect.flatMap`.
 * 5. Must return an Effect.
 *
 * @param input - The input data for the request.
 * @returns An Effect that resolves to the result of the service.
 */
export const changePasswordController = (input: unknown) =>
  pipe(
    input,
    Schema.decodeUnknown(ChangePasswordServerParams),
    Effect.flatMap(changePasswordService),
  );
