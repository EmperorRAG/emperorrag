import * as Schema from "effect/Schema";
import { EmailSchema } from "../../emails/email.schema";
import { PasswordSchema } from "../../passwords/password.schema";
import { UrlSchema } from "../../urls/url.schema";

export class SignInEmailCommand extends Schema.TaggedClass<SignInEmailCommand>()(
  "SignInEmailCommand",
  {
    email: EmailSchema,
    password: PasswordSchema({ minLength: 8, maxLength: 100 }),
    callbackURL: Schema.optional(UrlSchema),
    rememberMe: Schema.optional(Schema.Boolean),
  },
) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(SignInEmailCommand)(input);
  }

  static encode(value: SignInEmailCommand) {
    return Schema.encode(SignInEmailCommand)(value);
  }
}
