import * as Effect from "effect/Effect";
import { pipe } from "effect/Function";
import * as Schema from "effect/Schema";
import { changeEmailServerService } from "./changeEmail.service";
import { ChangeEmailServerParams } from "./changeEmail.types";

/**
 * Controller for handling change email requests.
 *
 * Acceptance Criteria:
 * 1. Must export a function named `changeEmailServerController`.
 * 2. Must take an `unknown` input.
 * 3. Must validate the input against the `ChangeEmailServerParams` schema using `Schema.decodeUnknown`.
 * 4. Must delegate processing to `changeEmailServerService` using `Effect.flatMap`.
 * 5. Must return an Effect.
 *
 * @param input - The input data for the request.
 * @returns An Effect that resolves to the result of the service.
 */
export const changeEmailServerController = (input: unknown) =>
  pipe(
    input,
    Schema.decodeUnknown(ChangeEmailServerParams),
    Effect.flatMap(changeEmailServerService),
  );
