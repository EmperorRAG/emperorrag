import * as Effect from "effect/Effect";
import { pipe } from "effect/Function";
import * as Schema from "effect/Schema";
import { setPasswordServerService } from "./setPassword.service";
import { SetPasswordServerParams } from "./setPassword.types";

/**
 * Controller for handling set password requests.
 *
 * Acceptance Criteria:
 * 1. Must export a function named `setPasswordServerController`.
 * 2. Must take an `unknown` input.
 * 3. Must validate the input against the `SetPasswordServerParams` schema using `Schema.decodeUnknown`.
 * 4. Must delegate processing to `setPasswordServerService` using `Effect.flatMap`.
 * 5. Must return an Effect.
 *
 * @param input - The input data for the request.
 * @returns An Effect that resolves to the result of the service.
 */
export const setPasswordServerController = (input: unknown) =>
  pipe(
    input,
    Schema.decodeUnknown(SetPasswordServerParams),
    Effect.flatMap(setPasswordServerService),
  );
