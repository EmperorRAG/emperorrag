import * as Schema from "effect/Schema";

export class ApiError extends Schema.TaggedError<ApiError>()(
  "ApiError",
  {
    message: Schema.String,
    status: Schema.optional(Schema.Number),
    cause: Schema.optional(Schema.Unknown),
  },
) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(ApiError)(input);
  }

  static encode(value: ApiError) {
    return Schema.encode(ApiError)(value);
  }
}
