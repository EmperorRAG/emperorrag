import { pipe } from "effect/Function";
import * as Schema from "effect/Schema";
import { VerifyEmailCommand } from "../../../../schema/commands/verify-email/VerifyEmail.command";

/**
 * Represents the parameters for the verify email server operation.
 *
 * Acceptance Criteria:
 * 1. Must export a class named `VerifyEmailServerParams`.
 * 2. Must extend `Schema.TaggedClass<VerifyEmailServerParams>()`.
 * 3. Must define a `body` property using the appropriate Command schema or structure.
 * 4. Must include optional `headers`, `asResponse`, and `returnHeaders` if supported by the API.
 * 5. Must provide static `decode` and `encode` methods.
 */
export class VerifyEmailServerParams extends Schema.TaggedClass<VerifyEmailServerParams>()(
  "VerifyEmailServerParams",
  {
    body: VerifyEmailCommand,
    headers: Schema.optional(Schema.instanceOf(Headers)),
    asResponse: Schema.optional(Schema.Boolean),
    returnHeaders: Schema.optional(Schema.Boolean),
  },
) {
  static decode(input: unknown) {
    return pipe(input, Schema.decodeUnknown(VerifyEmailServerParams));
  }

  static encode(value: VerifyEmailServerParams) {
    return pipe(value, Schema.encode(VerifyEmailServerParams));
  }
}
