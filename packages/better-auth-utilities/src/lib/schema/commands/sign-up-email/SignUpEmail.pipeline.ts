import { Effect, ParseResult, Schema } from "effect";
import { pipe } from "effect/Function";
import { SignUpEmailAuthServerParamsToCommandWithTransportCommandTransform } from "../../transport/SignUpEmailAuthServerParamsToCommandWithTransportCommand.transform";
import { SignUpEmailCommand } from "./SignUpEmail.command";
import { SignUpEmailAuthServerParams } from "./SignUpEmailAuthServer.params";
import { UnknownCommandWithTransportCommandToSignUpEmailCommandTransform } from "./UnknownCommandWithTransportCommandToSignUpEmailCommand.transform";

export class EmailAuthServerInputError extends Schema.TaggedError<EmailAuthServerInputError>()(
  "EmailAuthServerInputError",
  {
    message: Schema.String,
    cause: Schema.Unknown,
  },
) {}

export const SignUpEmailAuthServerParamsToSignUpEmailCommand = (raw: unknown) =>
  pipe(
    raw,
    Schema.decode(
      Schema.transformOrFail(Schema.Unknown, SignUpEmailAuthServerParams, {
        strict: true,
        decode: (input) =>
          Schema.decodeUnknown(SignUpEmailAuthServerParams)(input).pipe(
            Effect.mapError(
              () =>
                new ParseResult.Type(
                  SignUpEmailAuthServerParams.ast,
                  input,
                  "Failed to decode server params",
                ),
            ),
          ),
        encode: (output) =>
          Schema.encode(SignUpEmailAuthServerParams)(
            output as unknown as SignUpEmailAuthServerParams,
          ).pipe(
            Effect.mapError(
              () =>
                new ParseResult.Type(
                  SignUpEmailAuthServerParams.ast,
                  output,
                  "Failed to encode server params",
                ),
            ),
          ),
      }),
    ),
    Effect.flatMap((params) =>
      pipe(
        params,
        Schema.decodeUnknown(
          SignUpEmailAuthServerParamsToCommandWithTransportCommandTransform,
        ),
        Effect.mapError(
          (cause) =>
            new EmailAuthServerInputError({
              message: "Failed to transform params to transport command",
              cause,
            }),
        ),
      )
    ),
    Effect.flatMap((transportCmd) =>
      pipe(
        transportCmd,
        Schema.decodeUnknown(
          UnknownCommandWithTransportCommandToSignUpEmailCommandTransform,
        ),
        Effect.mapError(
          (cause) =>
            new EmailAuthServerInputError({
              message: "Failed to transform transport command to sign up command",
              cause,
            }),
        ),
      )
    ),
    Effect.map(
      (cmdWithTransport) => new SignUpEmailCommand(cmdWithTransport.command),
    ),
  );
