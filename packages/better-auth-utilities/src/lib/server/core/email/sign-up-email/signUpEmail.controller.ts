import { Effect, Schema } from "effect";
import { pipe } from "effect/Function";
import { signUpEmailServerService } from "./signUpEmail.service";
import { SignUpEmailServerParams } from "./SignUpEmail.types";

export const signUpEmailServerController = (input: unknown) =>
  pipe(
    input,
    Schema.decodeUnknown(SignUpEmailServerParams),
    Effect.flatMap(signUpEmailServerService),
  );
