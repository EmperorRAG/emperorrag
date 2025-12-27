import { pipe } from "effect/Function";
import * as Schema from "effect/Schema";
import { ChangePasswordCommand } from "../../../../schema/commands/change-password/ChangePassword.command";

/**
 * Represents the parameters for the change password server operation.
 *
 * Acceptance Criteria:
 * 1. Must export a class named `ChangePasswordServerParams`.
 * 2. Must extend `Schema.TaggedClass<ChangePasswordServerParams>()`.
 * 3. Must define a `body` property using the appropriate Command schema or structure.
 * 4. Must include optional `headers`, `asResponse`, and `returnHeaders` if supported by the API.
 * 5. Must provide static `decode` and `encode` methods.
 */
export class ChangePasswordServerParams extends Schema.TaggedClass<ChangePasswordServerParams>()(
  "ChangePasswordServerParams",
  {
    body: ChangePasswordCommand,
    headers: Schema.optional(Schema.instanceOf(Headers)),
    asResponse: Schema.optional(Schema.Boolean),
    returnHeaders: Schema.optional(Schema.Boolean),
  },
) {
  static decode(input: unknown) {
    return pipe(input, Schema.decodeUnknown(ChangePasswordServerParams));
  }

  static encode(value: ChangePasswordServerParams) {
    return pipe(value, Schema.encode(ChangePasswordServerParams));
  }
}
