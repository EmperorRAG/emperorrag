import { Schema } from "effect";
import { SignUpEmailCommand } from "./SignUpEmail.command";

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
    return Schema.decodeUnknown(SignUpEmailAuthServerParams)(input);
  }

  static encode(value: SignUpEmailAuthServerParams) {
    return Schema.encode(SignUpEmailAuthServerParams)(value);
  }
}
