import { Schema } from "effect";
import { pipe } from "effect/Function";
import { SetPasswordCommand } from "../../../../schema/commands/set-password/SetPassword.command";

/**
 * Represents the parameters for the set password server operation.
 *
 * Acceptance Criteria:
 * 1. Must export a class named `SetPasswordServerParams`.
 * 2. Must extend `Schema.TaggedClass<SetPasswordServerParams>()`.
 * 3. Must define a `body` property using the appropriate Command schema or structure.
 * 4. Must include optional `headers`, `asResponse`, and `returnHeaders` if supported by the API.
 * 5. Must provide static `decode` and `encode` methods.
 */
export class SetPasswordServerParams extends Schema.TaggedClass<SetPasswordServerParams>()(
  "SetPasswordServerParams",
  {
    body: SetPasswordCommand,
    headers: Schema.optional(Schema.instanceOf(Headers)),
    asResponse: Schema.optional(Schema.Boolean),
    returnHeaders: Schema.optional(Schema.Boolean),
  },
) {
  static decode(input: unknown) {
    return pipe(input, Schema.decodeUnknown(SetPasswordServerParams));
  }

  static encode(value: SetPasswordServerParams) {
    return pipe(value, Schema.encode(SetPasswordServerParams));
  }
}
