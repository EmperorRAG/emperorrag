import { Schema } from "effect";
import { pipe } from "effect/Function";
import { SignOutCommand } from "../../../../schema/commands/sign-out/SignOut.command";

/**
 * Represents the parameters for the sign-out email server operation.
 *
 * Acceptance Criteria:
 * 1. Must export a class named `SignOutEmailServerParams`.
 * 2. Must extend `Schema.TaggedClass<SignOutEmailServerParams>()`.
 * 3. Must define a `body` property using the appropriate Command schema or structure.
 * 4. Must include optional `headers`, `asResponse`, and `returnHeaders` if supported by the API.
 * 5. Must provide static `decode` and `encode` methods.
 */
export class SignOutEmailServerParams extends Schema.TaggedClass<SignOutEmailServerParams>()(
  "SignOutEmailServerParams",
  {
    body: SignOutCommand,
    headers: Schema.optional(Schema.instanceOf(Headers)),
    asResponse: Schema.optional(Schema.Boolean),
    returnHeaders: Schema.optional(Schema.Boolean),
  },
) {
  static decode(input: unknown) {
    return pipe(input, Schema.decodeUnknown(SignOutEmailServerParams));
  }

  static encode(value: SignOutEmailServerParams) {
    return pipe(value, Schema.encode(SignOutEmailServerParams));
  }
}
