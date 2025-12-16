import { Schema } from "effect";

/**
 * @description Schema for Better Auth Verification
 */
export class Verification extends Schema.TaggedClass<Verification>()("Verification", {
  id: Schema.String,
  identifier: Schema.String,
  value: Schema.String,
  expiresAt: Schema.Date,
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
}) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(Verification)(input);
  }

  static encode(value: Verification) {
    return Schema.encode(Verification)(value);
  }
}
