import * as Schema from "effect/Schema";

export class SessionError extends Schema.TaggedError<SessionError>()(
  "SessionError",
  {
    message: Schema.String,
    cause: Schema.optional(Schema.Unknown),
  },
) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(SessionError)(input);
  }

  static encode(value: SessionError) {
    return Schema.encode(SessionError)(value);
  }
}
