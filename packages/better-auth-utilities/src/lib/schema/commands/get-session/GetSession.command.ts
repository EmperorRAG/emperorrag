import * as Schema from "effect/Schema";

export class GetSessionCommand extends Schema.TaggedClass<GetSessionCommand>()(
  "GetSessionCommand",
  {},
) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(GetSessionCommand)(input);
  }

  static encode(value: GetSessionCommand) {
    return Schema.encode(GetSessionCommand)(value);
  }
}
