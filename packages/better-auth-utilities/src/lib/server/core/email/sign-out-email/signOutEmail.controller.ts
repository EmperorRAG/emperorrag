import { Effect, Schema } from "effect";
import { pipe } from "effect/Function";
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
    Effect.flatMap(signOutEmailServerService),
  );
