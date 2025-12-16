import { Schema } from "effect";
import { EmailSchema } from "../../email.schema";
import { UrlSchema } from "../../url.schema";

export class RequestPasswordResetCommand
  extends Schema.TaggedClass<RequestPasswordResetCommand>()("RequestPasswordResetCommand", {
    email: EmailSchema,
    redirectTo: Schema.optional(UrlSchema),
  })
{
  static decode(input: unknown) {
    return Schema.decodeUnknown(RequestPasswordResetCommand)(input);
  }

  static encode(value: RequestPasswordResetCommand) {
    return Schema.encode(RequestPasswordResetCommand)(value);
  }
}
