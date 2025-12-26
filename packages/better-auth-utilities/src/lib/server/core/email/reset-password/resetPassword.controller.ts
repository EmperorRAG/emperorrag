import { Effect, Schema } from "effect";
import { pipe } from "effect/Function";
import { resetPasswordService } from "./resetPassword.service";
import { ResetPasswordServerParams } from "./resetPassword.types";

/**
 * Controller for handling reset password requests.
 *
 * Acceptance Criteria:
 * 1. Must export a function named `resetPasswordController`.
 * 2. Must take an `unknown` input.
 * 3. Must validate the input against the `ResetPasswordServerParams` schema using `Schema.decodeUnknown`.
 * 4. Must delegate processing to `resetPasswordService` using `Effect.flatMap`.
 * 5. Must return an Effect.
 *
 * @param input - The input data for the request.
 * @returns An Effect that resolves to the result of the service.
 */
export const resetPasswordController = (input: unknown) =>
  pipe(
    input,
    Schema.decodeUnknown(ResetPasswordServerParams),
    Effect.flatMap(resetPasswordService),
  );
