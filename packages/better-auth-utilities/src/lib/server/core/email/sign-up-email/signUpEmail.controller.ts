import { Effect, Schema } from "effect";
import { pipe } from "effect/Function";
import { signUpEmailServerService } from "./signUpEmail.service";
import { SignUpEmailServerParams } from "./signUpEmail.types";

/**
 * Controller for handling sign-up email requests.
 *
 * This function takes an unknown input, validates it against the `SignUpEmailServerParams` schema,
 * and then delegates the processing to the `signUpEmailServerService`.
 *
 * @param input - The input data for the sign-up email request.
 * @returns An Effect that resolves to the result of the sign-up email service.
 */
export const signUpEmailServerController = (input: unknown) =>
  pipe(
    input,
    Schema.decodeUnknown(SignUpEmailServerParams),
    Effect.flatMap(signUpEmailServerService),
  );
