import { Schema } from "effect";
import { pipe } from "effect/Function";
import { RequestPasswordResetCommand } from "../../../../schema/commands/request-password-reset/RequestPasswordReset.command";

/**
 * Represents the parameters for the request password reset server operation.
 *
 * Acceptance Criteria:
 * 1. Must export a class named `RequestPasswordResetServerParams`.
 * 2. Must extend `Schema.TaggedClass<RequestPasswordResetServerParams>()`.
 * 3. Must define a `body` property using the appropriate Command schema or structure.
 * 4. Must include optional `headers`, `asResponse`, and `returnHeaders` if supported by the API.
 * 5. Must provide static `decode` and `encode` methods.
 */
export class RequestPasswordResetServerParams extends Schema.TaggedClass<RequestPasswordResetServerParams>()(
  "RequestPasswordResetServerParams",
  {
    body: RequestPasswordResetCommand,
    headers: Schema.optional(Schema.instanceOf(Headers)),
    asResponse: Schema.optional(Schema.Boolean),
    returnHeaders: Schema.optional(Schema.Boolean),
  },
) {
  static decode(input: unknown) {
    return pipe(input, Schema.decodeUnknown(RequestPasswordResetServerParams));
  }

  static encode(value: RequestPasswordResetServerParams) {
    return pipe(value, Schema.encode(RequestPasswordResetServerParams));
  }
}
