import { Effect, Schema } from "effect";
import { pipe } from "effect/Function";
import { changeEmailService } from "./changeEmail.service";
import { ChangeEmailServerParams } from "./changeEmail.types";

/**
 * Controller for handling change email requests.
 *
 * Acceptance Criteria:
 * 1. Must export a function named `changeEmailController`.
 * 2. Must take an `unknown` input.
 * 3. Must validate the input against the `ChangeEmailServerParams` schema using `Schema.decodeUnknown`.
 * 4. Must delegate processing to `changeEmailService` using `Effect.flatMap`.
 * 5. Must return an Effect.
 *
 * @param input - The input data for the request.
 * @returns An Effect that resolves to the result of the service.
 */
export const changeEmailController = (input: unknown) =>
  pipe(
    input,
    Schema.decodeUnknown(ChangeEmailServerParams),
    Effect.flatMap(changeEmailService),
  );
