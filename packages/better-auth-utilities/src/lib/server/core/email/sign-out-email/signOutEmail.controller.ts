import * as Effect from "effect/Effect";
import { pipe } from "effect/Function";
import * as Schema from "effect/Schema";
import { InputError } from "../../../../errors/input.error";
import { signOutEmailServerService } from "./signOutEmail.service";
import { SignOutEmailServerParams } from "./signOutEmail.types";

/**
 * Controller for handling sign-out email requests.
 *
 * Acceptance Criteria:
 * 1. Must export a function named `signOutEmailServerController`.
 * 2. Must take an `unknown` input.
 * 3. Must validate the input against the `SignOutEmailServerParams` schema using `Schema.decodeUnknown`.
 * 4. Must delegate processing to `signOutEmailServerService` using `Effect.flatMap`.
 * 5. Must return an Effect.
 *
 * @param input - The input data for the request.
 * @returns An Effect that resolves to the result of the service.
 */
export const signOutEmailServerController = (input: unknown) =>
  pipe(
    input,
    Schema.decodeUnknown(SignOutEmailServerParams),
    Effect.mapError(
      (cause) => new InputError({ message: "Invalid input", cause }),
    ),
    Effect.flatMap(signOutEmailServerService),
  );
