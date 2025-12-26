import { Schema } from "effect";
import { pipe } from "effect/Function";
import { SignUpEmailCommand } from "../../commands/sign-up-email/SignUpEmail.command";
import { TransportCommand } from "../../transport/Transport.command";

export class SignUpEmailAndTransportParams extends Schema.TaggedClass<SignUpEmailAndTransportParams>()(
  "SignUpEmailAndTransportParams",
  {
    command: SignUpEmailCommand,
    transport: TransportCommand,
  },
) {
  static decode(input: unknown) {
    return pipe(input, Schema.decodeUnknown(SignUpEmailAndTransportParams));
  }

  static encode(value: SignUpEmailAndTransportParams) {
    return pipe(value, Schema.encode(SignUpEmailAndTransportParams));
  }
}
