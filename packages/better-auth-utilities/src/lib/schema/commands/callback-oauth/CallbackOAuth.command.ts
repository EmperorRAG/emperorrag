import { Schema } from "effect";

export class CallbackOAuthCommand extends Schema.TaggedClass<CallbackOAuthCommand>()(
  "CallbackOAuthCommand",
  {
    state: Schema.optional(Schema.String),
    code: Schema.optional(Schema.String),
    error: Schema.optional(Schema.String),
  },
) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(CallbackOAuthCommand)(input);
  }

  static encode(value: CallbackOAuthCommand) {
    return Schema.encode(CallbackOAuthCommand)(value);
  }
}
