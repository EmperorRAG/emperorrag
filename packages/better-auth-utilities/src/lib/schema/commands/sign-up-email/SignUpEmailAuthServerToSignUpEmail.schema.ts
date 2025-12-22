import { ParseResult, Schema } from "effect";
import { SignUpEmailAuthServerParams } from "../../params/sign-up-email-auth-server/SignUpEmailAuthServer.schema";
import { SignUpEmailCommand } from "./SignUpEmail.command";

export const SignUpEmailAuthServerToSignUpEmailTransform = Schema.transformOrFail(
  SignUpEmailAuthServerParams,
  SignUpEmailCommand,
  {
    strict: true,
    decode: (params) => ParseResult.succeed(params.body),
    encode: (command, _, ast) =>
      ParseResult.fail(
        new ParseResult.Forbidden(
          ast,
          command,
          "Encoding SignUpEmailCommand back to SignUpEmailAuthServerParams is forbidden.",
        ),
      ),
  },
);
