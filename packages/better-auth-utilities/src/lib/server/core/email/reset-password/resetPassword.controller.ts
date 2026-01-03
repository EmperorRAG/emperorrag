import * as Effect from "effect/Effect";
import { pipe } from "effect/Function";
import * as Schema from "effect/Schema";
import { mapInputError } from "../../../../pipeline/map-input-error/mapInputError";
import { resetPasswordServerService } from "./resetPassword.service";
import { ResetPasswordServerParams } from "./resetPassword.types";

/**
 * Controller for handling reset password requests.
 *
 * Acceptance Criteria:
 * 1. Must export a function named `resetPasswordServerController`.
 * 2. Must take an `unknown` input.
 * 3. Must validate the input against the `ResetPasswordServerParams` schema using `Schema.decodeUnknown`.
 * 4. Must delegate processing to `resetPasswordServerService` using `Effect.flatMap`.
 * 5. Must return an Effect.
 *
 * @param input - The input data for the request.
 * @returns An Effect that resolves to the result of the service.
 */
export const resetPasswordServerController = (input: unknown) =>
  pipe(
    input,
    Schema.decodeUnknown(ResetPasswordServerParams),
    Effect.catchAll(mapInputError),
    Effect.flatMap(resetPasswordServerService),
  );
