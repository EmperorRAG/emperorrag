import { Effect, ParseResult, Schema } from "effect";
import { UnknownCommandWithTransportCommand } from "../../transport/UnknownWithTransport.command";
import { SignUpEmailCommand } from "./SignUpEmail.command";
import { SignUpEmailCommandWithTransportCommand } from "./SignUpEmailWithTransport.command";

export const UnknownCommandWithTransportCommandToSignUpEmailCommandTransform = Schema.transformOrFail(
  UnknownCommandWithTransportCommand,
  SignUpEmailCommandWithTransportCommand,
  {
    decode: (input) => {
      return Schema.decodeUnknown(SignUpEmailCommand)(input.command).pipe(
        Effect.mapError((issue) => new ParseResult.Pointer("command", input.command, issue.issue)),
        Effect.map(
          (command) =>
            new SignUpEmailCommandWithTransportCommand({
              command,
              ctx: input.context,
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
