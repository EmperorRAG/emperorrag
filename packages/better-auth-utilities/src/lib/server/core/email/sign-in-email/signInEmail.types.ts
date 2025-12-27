import { pipe } from "effect/Function";
import * as Schema from "effect/Schema";
import { SignInEmailCommand } from "../../../../schema/commands/sign-in-email/SignInEmail.command";

/**
 * Represents the parameters for the sign-in email server operation.
 *
 * Acceptance Criteria:
 * 1. Must export a class named `SignInEmailServerParams`.
 * 2. Must extend `Schema.TaggedClass<SignInEmailServerParams>()`.
 * 3. Must define a `body` property using the appropriate Command schema or structure.
 * 4. Must include optional `headers`, `asResponse`, and `returnHeaders` if supported by the API.
 * 5. Must provide static `decode` and `encode` methods.
 */
export class SignInEmailServerParams extends Schema.TaggedClass<SignInEmailServerParams>()(
  "SignInEmailServerParams",
  {
    body: SignInEmailCommand,
    headers: Schema.optional(Schema.instanceOf(Headers)),
    asResponse: Schema.optional(Schema.Boolean),
    returnHeaders: Schema.optional(Schema.Boolean),
  },
) {
  static decode(input: unknown) {
    return pipe(input, Schema.decodeUnknown(SignInEmailServerParams));
  }

  static encode(value: SignInEmailServerParams) {
    return pipe(value, Schema.encode(SignInEmailServerParams));
  }
}
