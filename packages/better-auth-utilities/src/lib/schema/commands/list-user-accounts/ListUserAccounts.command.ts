import { Schema } from "effect";

export class ListUserAccountsCommand
  extends Schema.TaggedClass<ListUserAccountsCommand>()("ListUserAccountsCommand", {})
{
  static decode(input: unknown) {
    return Schema.decodeUnknown(ListUserAccountsCommand)(input);
  }

  static encode(value: ListUserAccountsCommand) {
    return Schema.encode(ListUserAccountsCommand)(value);
  }
}
