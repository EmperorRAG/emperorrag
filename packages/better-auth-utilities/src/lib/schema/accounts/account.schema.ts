import { Schema } from "effect";

/**
 * @description Schema for Better Auth Account
 */
export class Account extends Schema.TaggedClass<Account>()("Account", {
  id: Schema.String,
  userId: Schema.String,
  accountId: Schema.String,
  providerId: Schema.String,
  accessToken: Schema.optional(Schema.String),
  refreshToken: Schema.optional(Schema.String),
  accessTokenExpiresAt: Schema.optional(Schema.Date),
  refreshTokenExpiresAt: Schema.optional(Schema.Date),
  scope: Schema.optional(Schema.String),
  idToken: Schema.optional(Schema.String),
  password: Schema.optional(Schema.String),
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
}) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(Account)(input);
  }

  static encode(value: Account) {
    return Schema.encode(Account)(value);
  }
}
