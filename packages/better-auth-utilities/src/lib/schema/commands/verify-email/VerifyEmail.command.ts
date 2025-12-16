import { Schema } from "effect";
import { UrlSchema } from "../../urls/url.schema";

export class VerifyEmailCommand extends Schema.TaggedClass<VerifyEmailCommand>()("VerifyEmailCommand", {
  token: Schema.String,
  callbackURL: Schema.optional(UrlSchema),
}) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(VerifyEmailCommand)(input);
  }

  static encode(value: VerifyEmailCommand) {
    return Schema.encode(VerifyEmailCommand)(value);
  }
}
