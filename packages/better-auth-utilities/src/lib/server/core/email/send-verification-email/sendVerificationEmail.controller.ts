import { Effect, Schema } from "effect";
import { pipe } from "effect/Function";
import { sendVerificationEmailService } from "./sendVerificationEmail.service";
import { SendVerificationEmailServerParams } from "./sendVerificationEmail.types";

/**
 * Controller for handling send verification email requests.
 *
 * Acceptance Criteria:
 * 1. Must export a function named `sendVerificationEmailController`.
 * 2. Must take an `unknown` input.
 * 3. Must validate the input against the `SendVerificationEmailServerParams` schema using `Schema.decodeUnknown`.
 * 4. Must delegate processing to `sendVerificationEmailService` using `Effect.flatMap`.
 * 5. Must return an Effect.
 *
 * @param input - The input data for the request.
 * @returns An Effect that resolves to the result of the service.
 */
export const sendVerificationEmailController = (input: unknown) =>
  pipe(
    input,
    Schema.decodeUnknown(SendVerificationEmailServerParams),
    Effect.flatMap(sendVerificationEmailService),
  );
