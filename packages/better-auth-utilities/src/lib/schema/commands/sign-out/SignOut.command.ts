import { Schema } from "effect";

export class SignOutCommand extends Schema.TaggedClass<SignOutCommand>()("SignOutCommand", {}) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(SignOutCommand)(input);
  }

  static encode(value: SignOutCommand) {
    return Schema.encode(SignOutCommand)(value);
  }
}
