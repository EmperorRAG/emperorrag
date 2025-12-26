import { Schema } from "effect";
import { pipe } from "effect/Function";
import { ResetPasswordCommand } from "../../../../schema/commands/reset-password/ResetPassword.command";

/**
 * Represents the parameters for the reset password server operation.
 *
 * Acceptance Criteria:
 * 1. Must export a class named `ResetPasswordServerParams`.
 * 2. Must extend `Schema.TaggedClass<ResetPasswordServerParams>()`.
 * 3. Must define a `body` property using the appropriate Command schema or structure.
 * 4. Must include optional `headers`, `asResponse`, and `returnHeaders` if supported by the API.
 * 5. Must provide static `decode` and `encode` methods.
 */
export class ResetPasswordServerParams extends Schema.TaggedClass<ResetPasswordServerParams>()(
  "ResetPasswordServerParams",
  {
    body: ResetPasswordCommand,
    headers: Schema.optional(Schema.instanceOf(Headers)),
    asResponse: Schema.optional(Schema.Boolean),
    returnHeaders: Schema.optional(Schema.Boolean),
  },
) {
  static decode(input: unknown) {
    return pipe(input, Schema.decodeUnknown(ResetPasswordServerParams));
  }

  static encode(value: ResetPasswordServerParams) {
    return pipe(value, Schema.encode(ResetPasswordServerParams));
  }
}
