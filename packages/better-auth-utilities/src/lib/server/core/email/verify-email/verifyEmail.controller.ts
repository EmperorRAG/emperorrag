import * as Effect from "effect/Effect";
import { pipe } from "effect/Function";
import * as Schema from "effect/Schema";
import { mapInputError } from "../../../../pipeline/map-input-error/mapInputError";
import { verifyEmailServerService } from "./verifyEmail.service";
import { VerifyEmailServerParams } from "./verifyEmail.types";

/**
 * Controller for handling verify email requests.
 *
 * Acceptance Criteria:
 * 1. Must export a function named `verifyEmailServerController`.
 * 2. Must take an `unknown` input.
 * 3. Must validate the input against the `VerifyEmailServerParams` schema using `Schema.decodeUnknown`.
 * 4. Must delegate processing to `verifyEmailServerService` using `Effect.flatMap`.
 * 5. Must return an Effect.
 *
 * @param input - The input data for the request.
 * @returns An Effect that resolves to the result of the service.
 */
export const verifyEmailServerController = (input: unknown) =>
  pipe(
    input,
    Schema.decodeUnknown(VerifyEmailServerParams),
    Effect.catchAll(mapInputError),
    Effect.flatMap(verifyEmailServerService),
  );
