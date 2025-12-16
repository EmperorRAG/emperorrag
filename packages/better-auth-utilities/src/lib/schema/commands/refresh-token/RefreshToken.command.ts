import { Schema } from "effect";

export class RefreshTokenCommand extends Schema.TaggedClass<RefreshTokenCommand>()("RefreshTokenCommand", {}) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(RefreshTokenCommand)(input);
  }

  static encode(value: RefreshTokenCommand) {
    return Schema.encode(RefreshTokenCommand)(value);
  }
}
