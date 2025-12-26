import { Schema } from "effect";
import { pipe } from "effect/Function";
import { SignUpEmailCommand } from "../../../../schema/commands/sign-up-email/SignUpEmail.command";

export class SignUpEmailServerParams extends Schema.TaggedClass<SignUpEmailServerParams>()(
  "SignUpEmailServerParams",
  {
    body: SignUpEmailCommand,
    headers: Schema.optional(Schema.instanceOf(Headers)),
    asResponse: Schema.optional(Schema.Boolean),
    returnHeaders: Schema.optional(Schema.Boolean),
  },
) {
  static decode(input: unknown) {
    return pipe(input, Schema.decodeUnknown(SignUpEmailServerParams));
  }

  static encode(value: SignUpEmailServerParams) {
    return pipe(value, Schema.encode(SignUpEmailServerParams));
  }

  toJSON() {
    return Schema.encodeSync(SignUpEmailServerParams)(this);
  }
}
