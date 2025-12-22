import { Effect, Schema } from "effect";
import { pipe } from "effect/Function";
import { SignUpEmailAuthServerParams } from "../../../../schema/params/sign-up-email-auth-server/SignUpEmailAuthServer.schema";
import { signUpEmailServerService } from "./signUpEmail.service";

export const signUpEmailServerController = (input: unknown) =>
  pipe(
    input,
    Schema.decodeUnknown(SignUpEmailAuthServerParams),
    Effect.flatMap(Schema.encode(SignUpEmailAuthServerParams)),
    Effect.flatMap(signUpEmailServerService),
  );
