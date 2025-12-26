import { Schema } from "effect";
import { pipe } from "effect/Function";
import { ForgetPasswordCommand } from "../../../../schema/commands/forget-password/ForgetPassword.command";

/**
 * Represents the parameters for the forget password server operation.
 *
 * Acceptance Criteria:
 * 1. Must export a class named `ForgetPasswordServerParams`.
 * 2. Must extend `Schema.TaggedClass<ForgetPasswordServerParams>()`.
 * 3. Must define a `body` property using the appropriate Command schema or structure.
 * 4. Must include optional `headers`, `asResponse`, and `returnHeaders` if supported by the API.
 * 5. Must provide static `decode` and `encode` methods.
 */
export class ForgetPasswordServerParams extends Schema.TaggedClass<ForgetPasswordServerParams>()(
  "ForgetPasswordServerParams",
  {
    body: ForgetPasswordCommand,
    headers: Schema.optional(Schema.instanceOf(Headers)),
    asResponse: Schema.optional(Schema.Boolean),
    returnHeaders: Schema.optional(Schema.Boolean),
  },
) {
  static decode(input: unknown) {
    return pipe(input, Schema.decodeUnknown(ForgetPasswordServerParams));
  }

  static encode(value: ForgetPasswordServerParams) {
    return pipe(value, Schema.encode(ForgetPasswordServerParams));
  }
}
