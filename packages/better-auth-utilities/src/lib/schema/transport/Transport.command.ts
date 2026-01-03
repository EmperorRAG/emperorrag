import * as Schema from "effect/Schema";

export class TransportCommand extends Schema.TaggedClass<TransportCommand>()(
  "TransportCommandCtx",
  {
    headers: Schema.optional(Schema.instanceOf(Headers)),
    asResponse: Schema.optional(Schema.Boolean),
    returnHeaders: Schema.optional(Schema.Boolean),
  },
) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(TransportCommand)(input);
  }

  static encode(value: TransportCommand) {
    return Schema.encode(TransportCommand)(value);
  }
}
