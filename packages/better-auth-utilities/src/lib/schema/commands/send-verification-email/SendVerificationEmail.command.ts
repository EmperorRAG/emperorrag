import { Schema } from "effect";
import { EmailSchema } from "../../email.schema";
import { UrlSchema } from "../../url.schema";

export class SendVerificationEmailCommand
  extends Schema.TaggedClass<SendVerificationEmailCommand>()("SendVerificationEmailCommand", {
    email: EmailSchema,
    callbackURL: Schema.optional(UrlSchema),
  })
{
  static decode(input: unknown) {
    return Schema.decodeUnknown(SendVerificationEmailCommand)(input);
  }

  static encode(value: SendVerificationEmailCommand) {
    return Schema.encode(SendVerificationEmailCommand)(value);
  }
}
