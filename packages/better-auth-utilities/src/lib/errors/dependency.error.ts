import * as Schema from "effect/Schema";

export class DependenciesError extends Schema.TaggedError<DependenciesError>()(
  "DependenciesError",
  {
    message: Schema.String,
    cause: Schema.optional(Schema.Unknown),
  },
) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(DependenciesError)(input);
  }

  static encode(value: DependenciesError) {
    return Schema.encode(DependenciesError)(value);
  }
}
