import { Schema } from "effect";
import { ImageSchema } from "../../images/image.schema";
import { NameSchema } from "../../name.schema";

export class UpdateUserCommand extends Schema.TaggedClass<UpdateUserCommand>()(
  "UpdateUserCommand",
  {
    name: Schema.optional(NameSchema),
    image: Schema.optional(ImageSchema),
    additionalFields: Schema.optional(
      Schema.Record({ key: Schema.String, value: Schema.Unknown }),
    ),
  },
) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(UpdateUserCommand)(input);
  }

  static encode(value: UpdateUserCommand) {
    return Schema.encode(UpdateUserCommand)(value);
  }
}
