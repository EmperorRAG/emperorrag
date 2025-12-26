import { Schema } from "effect";
import { pipe } from "effect/Function";
import { ChangeEmailCommand } from "../../../../schema/commands/change-email/ChangeEmail.command";

/**
 * Represents the parameters for the change email server operation.
 *
 * Acceptance Criteria:
 * 1. Must export a class named `ChangeEmailServerParams`.
 * 2. Must extend `Schema.TaggedClass<ChangeEmailServerParams>()`.
 * 3. Must define a `body` property using the appropriate Command schema or structure.
 * 4. Must include optional `headers`, `asResponse`, and `returnHeaders` if supported by the API.
 * 5. Must provide static `decode` and `encode` methods.
 */
export class ChangeEmailServerParams extends Schema.TaggedClass<ChangeEmailServerParams>()(
  "ChangeEmailServerParams",
  {
    body: ChangeEmailCommand,
    headers: Schema.optional(Schema.instanceOf(Headers)),
    asResponse: Schema.optional(Schema.Boolean),
    returnHeaders: Schema.optional(Schema.Boolean),
  },
) {
  static decode(input: unknown) {
    return pipe(input, Schema.decodeUnknown(ChangeEmailServerParams));
  }

  static encode(value: ChangeEmailServerParams) {
    return pipe(value, Schema.encode(ChangeEmailServerParams));
  }
}
