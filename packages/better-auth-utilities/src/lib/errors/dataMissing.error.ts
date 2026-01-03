import * as Schema from "effect/Schema";

export class DataMissingError extends Schema.TaggedError<DataMissingError>()(
  "DataMissingError",
  {
    message: Schema.String,
    cause: Schema.optional(Schema.Unknown),
  },
) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(DataMissingError)(input);
  }

  static encode(value: DataMissingError) {
    return Schema.encode(DataMissingError)(value);
  }
}
