import { Schema } from "effect";
import { UrlSchema } from "../../urls/url.schema";

export class LinkSocialAccountCommand
  extends Schema.TaggedClass<LinkSocialAccountCommand>()("LinkSocialAccountCommand", {
    provider: Schema.String,
    callbackURL: Schema.optional(UrlSchema),
  })
{
  static decode(input: unknown) {
    return Schema.decodeUnknown(LinkSocialAccountCommand)(input);
  }

  static encode(value: LinkSocialAccountCommand) {
    return Schema.encode(LinkSocialAccountCommand)(value);
  }
}
