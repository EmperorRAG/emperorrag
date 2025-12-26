import { Schema } from "effect";

export class GetAccessTokenCommand extends Schema.TaggedClass<GetAccessTokenCommand>()(
  "GetAccessTokenCommand",
  {},
) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(GetAccessTokenCommand)(input);
  }

  static encode(value: GetAccessTokenCommand) {
    return Schema.encode(GetAccessTokenCommand)(value);
  }
}
