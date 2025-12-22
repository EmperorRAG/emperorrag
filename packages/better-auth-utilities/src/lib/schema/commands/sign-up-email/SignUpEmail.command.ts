import { Schema } from "effect";
import { pipe } from "effect/Function";
import { Email } from "../../emails/email.schema";
import { Image } from "../../images/image.schema";
import { Name } from "../../names/name.schema";
import { PasswordSchema } from "../../passwords/password.schema";
import { Url } from "../../urls/url.schema";

export class SignUpEmailCommand extends Schema.TaggedClass<SignUpEmailCommand>()(
  "SignUpEmailCommand",
  {
    email: Email,
    password: PasswordSchema({ minLength: 8, maxLength: 100 }),
    name: Name,
    image: Schema.optional(Image),
    callbackURL: Schema.optional(Url),
    additionalFields: Schema.optional(
      Schema.Record({ key: Schema.String, value: Schema.Unknown }),
    ),
  },
) {
  static decode(input: unknown) {
    return pipe(input, Schema.decodeUnknown(SignUpEmailCommand));
  }

  static encode(value: SignUpEmailCommand) {
    return pipe(value, Schema.encode(SignUpEmailCommand));
  }
}
