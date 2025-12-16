import { Schema } from "effect";

export class DeleteUserCallbackCommand extends Schema.TaggedClass<DeleteUserCallbackCommand>()(
  "DeleteUserCallbackCommand",
  {
    token: Schema.String,
  },
) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(DeleteUserCallbackCommand)(input);
  }

  static encode(value: DeleteUserCallbackCommand) {
    return Schema.encode(DeleteUserCallbackCommand)(value);
  }
}
