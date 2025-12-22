import { Effect, ParseResult, Schema } from "effect";
import { SignUpEmailAndTransportParams } from "../../params/sign-up-email-and-transport/SignUpEmailAndTransport.schema";
import { UnknownCommandWithTransportCommand } from "../../transport/UnknownWithTransport.command";
import { SignUpEmailCommand } from "./SignUpEmail.command";

export const UnknownCommandWithTransportCommandToSignUpEmailCommandTransform = Schema.transformOrFail(
  UnknownCommandWithTransportCommand,
  SignUpEmailAndTransportParams,
  {
    decode: (input) => {
      return Schema.decodeUnknown(SignUpEmailCommand)(input.command).pipe(
        Effect.mapError(
          (issue) => new ParseResult.Pointer("command", input.command, issue.issue),
        ),
        Effect.map(
          (command) =>
            new SignUpEmailAndTransportParams({
              command,
              transport: input.transport,
            }),
        ),
      );
    },
    encode: (output) =>
      ParseResult.succeed(
        new UnknownCommandWithTransportCommand({
          command: output.command,
          context: output.ctx,
        }),
      ),
  },
);
