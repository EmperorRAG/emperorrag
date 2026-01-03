import * as Effect from "effect/Effect";
import { pipe } from "effect/Function";
import * as Schema from "effect/Schema";
import { mapInputError } from "../../../../pipeline/map-input-error/mapInputError";
import { signInEmailServerService } from "./signInEmail.service";
import { SignInEmailServerParams } from "./signInEmail.types";

/**
 * Controller for handling sign-in email requests.
 *
 * Acceptance Criteria:
 * 1. Must export a function named `signInEmailServerController`.
 * 2. Must take an `unknown` input.
 * 3. Must validate the input against the `SignInEmailServerParams` schema using `Schema.decodeUnknown`.
 * 4. Must delegate processing to `signInEmailServerService` using `Effect.flatMap`.
 * 5. Must return an Effect.
 *
 * @param input - The input data for the request.
 * @returns An Effect that resolves to the result of the service.
 */
export const signInEmailServerController = (input: unknown) =>
  pipe(
    input,
    Schema.decodeUnknown(SignInEmailServerParams),
    Effect.catchAll(mapInputError),
    Effect.flatMap(signInEmailServerService),
  );
