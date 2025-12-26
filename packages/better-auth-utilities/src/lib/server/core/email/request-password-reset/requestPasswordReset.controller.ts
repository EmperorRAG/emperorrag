import { Effect, Schema } from "effect";
import { pipe } from "effect/Function";
import { requestPasswordResetServerService } from "./requestPasswordReset.service";
import { RequestPasswordResetServerParams } from "./requestPasswordReset.types";

/**
 * Controller for handling request password reset requests.
 *
 * Acceptance Criteria:
 * 1. Must export a function named `requestPasswordResetServerController`.
 * 2. Must take an `unknown` input.
 * 3. Must validate the input against the `RequestPasswordResetServerParams` schema using `Schema.decodeUnknown`.
 * 4. Must delegate processing to `requestPasswordResetServerService` using `Effect.flatMap`.
 * 5. Must return an Effect.
 *
 * @param input - The input data for the request.
 * @returns An Effect that resolves to the result of the service.
 */
export const requestPasswordResetServerController = (input: unknown) =>
  pipe(
    input,
    Schema.decodeUnknown(RequestPasswordResetServerParams),
    Effect.flatMap(requestPasswordResetServerService),
  );
