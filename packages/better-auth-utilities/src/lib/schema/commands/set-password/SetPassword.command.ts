import { Schema } from "effect";
import { PasswordSchema } from "../../passwords/password.schema";

export class SetPasswordCommand extends Schema.TaggedClass<SetPasswordCommand>()("SetPasswordCommand", {
  newPassword: PasswordSchema({ minLength: 8, maxLength: 100 }),
  currentPassword: Schema.optional(PasswordSchema({ minLength: 1, maxLength: 100 })),
}) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(SetPasswordCommand)(input);
  }

  static encode(value: SetPasswordCommand) {
    return Schema.encode(SetPasswordCommand)(value);
  }
}
