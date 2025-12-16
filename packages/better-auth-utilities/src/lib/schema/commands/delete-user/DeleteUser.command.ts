import { Schema } from "effect";
import { PasswordSchema } from "../../password.schema";
import { UrlSchema } from "../../url.schema";

export class DeleteUserCommand extends Schema.TaggedClass<DeleteUserCommand>()("DeleteUserCommand", {
  password: Schema.optional(PasswordSchema({ minLength: 1, maxLength: 100 })),
  callbackURL: Schema.optional(UrlSchema),
}) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(DeleteUserCommand)(input);
  }

  static encode(value: DeleteUserCommand) {
    return Schema.encode(DeleteUserCommand)(value);
  }
}
