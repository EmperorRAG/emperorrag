import { Schema } from "effect";
import { pipe } from "effect/Function";
import { EmailSchema } from "../../emails/email.schema";
import { ImageSchema } from "../../images/image.schema";
import { NameSchema } from "../../names/name.schema";
import { PasswordSchema } from "../../passwords/password.schema";
import { UrlSchema } from "../../urls/url.schema";

export class SignUpEmailCommand extends Schema.TaggedClass<SignUpEmailCommand>()(
  "SignUpEmailCommand",
  {
    email: EmailSchema,
    password: PasswordSchema({ minLength: 8, maxLength: 100 }),
    name: NameSchema,
    image: Schema.optional(ImageSchema),
    callbackURL: Schema.optional(UrlSchema),
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

  toJSON() {
    return Schema.encodeSync(SignUpEmailCommand)(this);
  }
}
