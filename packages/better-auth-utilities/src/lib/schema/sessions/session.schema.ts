import { Schema } from "effect";

/**
 * @description Schema for Better Auth Session
 */
export class Session extends Schema.TaggedClass<Session>()("Session", {
  id: Schema.String,
  userId: Schema.String,
  token: Schema.String,
  expiresAt: Schema.Date,
  ipAddress: Schema.optional(Schema.String),
  userAgent: Schema.optional(Schema.String),
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
}) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(Session)(input);
  }

  static encode(value: Session) {
    return Schema.encode(Session)(value);
  }
}
