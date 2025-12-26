import { Effect, Schema } from "effect";
import { pipe } from "effect/Function";
import { signInEmailService } from "./signInEmail.service";
import { SignInEmailServerParams } from "./signInEmail.types";

/**
 * Controller for handling sign-in email requests.
 *
 * Acceptance Criteria:
 * 1. Must export a function named `signInEmailController`.
 * 2. Must take an `unknown` input.
 * 3. Must validate the input against the `SignInEmailServerParams` schema using `Schema.decodeUnknown`.
 * 4. Must delegate processing to `signInEmailService` using `Effect.flatMap`.
 * 5. Must return an Effect.
 *
 * @param input - The input data for the request.
 * @returns An Effect that resolves to the result of the service.
 */
export const signInEmailController = (input: unknown) =>
  pipe(
    input,
    Schema.decodeUnknown(SignInEmailServerParams),
    Effect.flatMap(signInEmailService),
  );
