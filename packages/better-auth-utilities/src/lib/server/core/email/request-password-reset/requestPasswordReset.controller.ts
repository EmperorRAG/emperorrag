import { Effect, Schema } from "effect";
import { pipe } from "effect/Function";
import { requestPasswordResetService } from "./requestPasswordReset.service";
import { RequestPasswordResetServerParams } from "./requestPasswordReset.types";

/**
 * Controller for handling request password reset requests.
 *
 * Acceptance Criteria:
 * 1. Must export a function named `requestPasswordResetController`.
 * 2. Must take an `unknown` input.
 * 3. Must validate the input against the `RequestPasswordResetServerParams` schema using `Schema.decodeUnknown`.
 * 4. Must delegate processing to `requestPasswordResetService` using `Effect.flatMap`.
 * 5. Must return an Effect.
 *
 * @param input - The input data for the request.
 * @returns An Effect that resolves to the result of the service.
 */
export const requestPasswordResetController = (input: unknown) =>
  pipe(
    input,
    Schema.decodeUnknown(RequestPasswordResetServerParams),
    Effect.flatMap(requestPasswordResetService),
  );
