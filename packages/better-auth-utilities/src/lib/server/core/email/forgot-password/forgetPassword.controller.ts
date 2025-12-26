import { Effect, Schema } from "effect";
import { pipe } from "effect/Function";
import { forgetPasswordService } from "./forgetPassword.service";
import { ForgetPasswordServerParams } from "./forgetPassword.types";

/**
 * Controller for handling forget password requests.
 *
 * Acceptance Criteria:
 * 1. Must export a function named `forgetPasswordController`.
 * 2. Must take an `unknown` input.
 * 3. Must validate the input against the `ForgetPasswordServerParams` schema using `Schema.decodeUnknown`.
 * 4. Must delegate processing to `forgetPasswordService` using `Effect.flatMap`.
 * 5. Must return an Effect.
 *
 * @param input - The input data for the request.
 * @returns An Effect that resolves to the result of the service.
 */
export const forgetPasswordController = (input: unknown) =>
  pipe(
    input,
    Schema.decodeUnknown(ForgetPasswordServerParams),
    Effect.flatMap(forgetPasswordService),
  );
