import { Schema } from "effect";

export class AccountInfoCommand extends Schema.TaggedClass<AccountInfoCommand>()("AccountInfoCommand", {}) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(AccountInfoCommand)(input);
  }

  static encode(value: AccountInfoCommand) {
    return Schema.encode(AccountInfoCommand)(value);
  }
}
