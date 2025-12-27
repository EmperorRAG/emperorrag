import * as Schema from "effect/Schema";
import { UrlSchema } from "../../urls/url.schema";

export class SignInSocialCommand extends Schema.TaggedClass<SignInSocialCommand>()(
  "SignInSocialCommand",
  {
    provider: Schema.String,
    callbackURL: Schema.optional(UrlSchema),
    errorCallbackURL: Schema.optional(UrlSchema),
    newUserCallbackURL: Schema.optional(UrlSchema),
    disableRedirect: Schema.optional(Schema.Boolean),
  },
) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(SignInSocialCommand)(input);
  }

  static encode(value: SignInSocialCommand) {
    return Schema.encode(SignInSocialCommand)(value);
  }
}
