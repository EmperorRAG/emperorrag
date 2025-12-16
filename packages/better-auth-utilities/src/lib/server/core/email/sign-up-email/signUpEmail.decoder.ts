import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import { AuthServerInputError } from "../../../../errors/authServer.error";
import { AdditionalFieldsSchema } from "../../../../schema/additional-fields.schema";
import { Email, EmailSchema } from "../../../../schema/email.schema";
import { Image, ImageSchema } from "../../../../schema/image.schema";
import { Name, NameSchema } from "../../../../schema/name.schema";
import { Password, PasswordSchema } from "../../../../schema/password.schema";
import { Url, UrlSchema } from "../../../../schema/url.schema";
import { AuthServerTag } from "../../../server.service";
import type { AuthServer } from "../../../server.types";

export class SignUpEmailCommand extends Data.TaggedClass("SignUpEmailCommand")<{
  name: Name;
  email: Email;
  password: Password;
  callbackURL?: Url;
  image?: Image;
  additionalFields: Readonly<Record<string, unknown>>;
}> {}

export const SignUpEmailCommandSchema = (authServer: AuthServer) => {
  const passwordPolicy = {
    minLength: authServer.options.emailAndPassword?.minPasswordLength ?? 8,
    maxLength: authServer.options.emailAndPassword?.maxPasswordLength ?? 32,
  };

  const KnownFields = Schema.Struct({
    name: NameSchema,
    email: EmailSchema,
    password: PasswordSchema(passwordPolicy),
    callbackURL: Schema.optional(UrlSchema),
    image: Schema.optional(ImageSchema),
  });

  const InputSchema = KnownFields.pipe(Schema.extend(Schema.Record({ key: Schema.String, value: Schema.Unknown })));

  return Schema.transformOrFail(InputSchema, Schema.instanceOf(SignUpEmailCommand), {
    strict: true,
    decode: (input, _, ast) =>
      Schema.decodeUnknown(AdditionalFieldsSchema(authServer))(input).pipe(
        Effect.mapError((error) => error.issue),
        Effect.map(
          (additionalFields) =>
            new SignUpEmailCommand({
              name: input.name,
              email: input.email,
              password: input.password,
              ...(input.callbackURL !== undefined ? { callbackURL: input.callbackURL } : {}),
              ...(input.image !== undefined ? { image: input.image } : {}),
              additionalFields,
            }),
        ),
      ),
    encode: (command, _, ast) =>
      Effect.succeed({
        name: command.name,
        email: command.email,
        password: command.password,
        ...(command.image !== undefined ? { image: command.image } : {}),
        ...(command.callbackURL !== undefined ? { callbackURL: command.callbackURL } : {}),
        ...command.additionalFields,
      }),
  });
};

export const decodeSignUpEmailCommand = (rawBody: unknown) =>
  Effect.flatMap(
    AuthServerTag,
    (authServer) =>
      Schema.decodeUnknown(SignUpEmailCommandSchema(authServer))(rawBody).pipe(
        Effect.mapError((e) => new AuthServerInputError({ message: "Invalid sign up input", cause: e })),
      ),
  );
