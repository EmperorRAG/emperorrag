import { Schema } from "effect";
import { EmailSchema } from "../../email.schema";
import { UrlSchema } from "../../url.schema";

export class ForgetPasswordCommand extends Schema.TaggedClass<ForgetPasswordCommand>()("ForgetPasswordCommand", {
  email: EmailSchema,
  redirectTo: Schema.optional(UrlSchema),
}) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(ForgetPasswordCommand)(input);
  }

  static encode(value: ForgetPasswordCommand) {
    return Schema.encode(ForgetPasswordCommand)(value);
  }
}
