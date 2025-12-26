import { Schema } from "effect";

export class Password extends Schema.TaggedClass<Password>()("Password", {
  value: Schema.String,
}) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(Password)(input);
  }

  static encode(value: Password) {
    return Schema.encode(Password)(value);
  }
}

type PasswordPolicy = {
  readonly minLength: number;
  readonly maxLength: number;
};

export const PasswordSchema = (policy: PasswordPolicy) =>
  Schema.transform(
    Schema.String.pipe(
      Schema.minLength(policy.minLength),
      Schema.maxLength(policy.maxLength),
    ),
    Password,
    {
      decode: (value) => new Password({ value }),
      encode: (password) => password.value,
    },
  );
