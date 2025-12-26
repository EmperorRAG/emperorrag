import { Effect, Schema } from "effect";
import { pipe } from "effect/Function";
import { verifyEmailService } from "./verifyEmail.service";
import { VerifyEmailServerParams } from "./verifyEmail.types";

/**
 * Controller for handling verify email requests.
 *
 * Acceptance Criteria:
 * 1. Must export a function named `verifyEmailController`.
 * 2. Must take an `unknown` input.
 * 3. Must validate the input against the `VerifyEmailServerParams` schema using `Schema.decodeUnknown`.
 * 4. Must delegate processing to `verifyEmailService` using `Effect.flatMap`.
 * 5. Must return an Effect.
 *
 * @param input - The input data for the request.
 * @returns An Effect that resolves to the result of the service.
 */
export const verifyEmailController = (input: unknown) =>
  pipe(
    input,
    Schema.decodeUnknown(VerifyEmailServerParams),
    Effect.flatMap(verifyEmailService),
  );
