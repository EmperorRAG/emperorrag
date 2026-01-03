import * as Schema from "effect/Schema";

export class ForgetPasswordCallbackCommand extends Schema.TaggedClass<ForgetPasswordCallbackCommand>()(
  "ForgetPasswordCallbackCommand",
  {
    token: Schema.String,
  },
) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(ForgetPasswordCallbackCommand)(input);
  }

  static encode(value: ForgetPasswordCallbackCommand) {
    return Schema.encode(ForgetPasswordCallbackCommand)(value);
  }
}
