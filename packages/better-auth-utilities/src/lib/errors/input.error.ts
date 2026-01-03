import * as Schema from "effect/Schema";

export class InputError extends Schema.TaggedError<InputError>()(
  "InputError",
  {
    message: Schema.String,
    cause: Schema.optional(Schema.Unknown),
  },
) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(InputError)(input);
  }

  static encode(value: InputError) {
    return Schema.encode(InputError)(value);
  }
}
