import { Schema } from "effect";
import { pipe } from "effect/Function";
import { SignUpEmailCommand } from "../../commands/sign-up-email/SignUpEmail.command";

export class SignUpEmailAuthServerParams extends Schema.TaggedClass<SignUpEmailAuthServerParams>()(
  "SignUpEmailAuthServerParams",
  {
    body: SignUpEmailCommand,
    headers: Schema.optional(Schema.instanceOf(Headers)),
    asResponse: Schema.optional(Schema.Boolean),
    returnHeaders: Schema.optional(Schema.Boolean),
  },
) {
  static decode(input: unknown) {
    return pipe(input, Schema.decodeUnknown(SignUpEmailAuthServerParams));
  }

  static encode(value: SignUpEmailAuthServerParams) {
    return pipe(value, Schema.encode(SignUpEmailAuthServerParams));
  }
}
