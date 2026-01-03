import * as Schema from "effect/Schema";

export class ListSessionsCommand extends Schema.TaggedClass<ListSessionsCommand>()(
  "ListSessionsCommand",
  {},
) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(ListSessionsCommand)(input);
  }

  static encode(value: ListSessionsCommand) {
    return Schema.encode(ListSessionsCommand)(value);
  }
}
