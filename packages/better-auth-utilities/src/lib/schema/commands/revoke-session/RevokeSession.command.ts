import { Schema } from "effect";

export class RevokeSessionCommand extends Schema.TaggedClass<RevokeSessionCommand>()("RevokeSessionCommand", {
  token: Schema.optional(Schema.String),
  id: Schema.optional(Schema.String),
}) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(RevokeSessionCommand)(input);
  }

  static encode(value: RevokeSessionCommand) {
    return Schema.encode(RevokeSessionCommand)(value);
  }
}
