import { Schema } from "effect";
import { pipe } from "effect/Function";
import { SendVerificationEmailCommand } from "../../../../schema/commands/send-verification-email/SendVerificationEmail.command";

/**
 * Represents the parameters for the send verification email server operation.
 *
 * Acceptance Criteria:
 * 1. Must export a class named `SendVerificationEmailServerParams`.
 * 2. Must extend `Schema.TaggedClass<SendVerificationEmailServerParams>()`.
 * 3. Must define a `body` property using the appropriate Command schema or structure.
 * 4. Must include optional `headers`, `asResponse`, and `returnHeaders` if supported by the API.
 * 5. Must provide static `decode` and `encode` methods.
 */
export class SendVerificationEmailServerParams extends Schema.TaggedClass<SendVerificationEmailServerParams>()(
  "SendVerificationEmailServerParams",
  {
    body: SendVerificationEmailCommand,
    headers: Schema.optional(Schema.instanceOf(Headers)),
    asResponse: Schema.optional(Schema.Boolean),
    returnHeaders: Schema.optional(Schema.Boolean),
  },
) {
  static decode(input: unknown) {
    return pipe(input, Schema.decodeUnknown(SendVerificationEmailServerParams));
  }

  static encode(value: SendVerificationEmailServerParams) {
    return pipe(value, Schema.encode(SendVerificationEmailServerParams));
  }
}
