import * as Schema from "effect/Schema";

export class RequestPasswordResetCallbackCommand extends Schema.TaggedClass<RequestPasswordResetCallbackCommand>()(
  "RequestPasswordResetCallbackCommand",
  {
    token: Schema.String,
  },
) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(RequestPasswordResetCallbackCommand)(input);
  }

  static encode(value: RequestPasswordResetCallbackCommand) {
    return Schema.encode(RequestPasswordResetCallbackCommand)(value);
  }
}
