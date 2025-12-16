import { Schema } from "effect";
import { EmailSchema } from "../../email.schema";
import { ImageSchema } from "../../image.schema";
import { NameSchema } from "../../name.schema";
import { PasswordSchema } from "../../password.schema";
import { UrlSchema } from "../../url.schema";

export class SignUpEmailCommand extends Schema.TaggedClass<SignUpEmailCommand>()("SignUpEmailCommand", {
  email: EmailSchema,
  password: PasswordSchema({ minLength: 8, maxLength: 100 }),
  name: NameSchema,
  image: Schema.optional(ImageSchema),
  callbackURL: Schema.optional(UrlSchema),
  additionalFields: Schema.optional(Schema.Record({ key: Schema.String, value: Schema.Unknown })),
}) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(SignUpEmailCommand)(input);
  }

  static encode(value: SignUpEmailCommand) {
    return Schema.encode(SignUpEmailCommand)(value);
  }
}
