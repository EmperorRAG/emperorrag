import { Schema } from "effect";

export class Email extends Schema.TaggedClass<Email>()("Email", {
  value: Schema.String.pipe(
    Schema.compose(Schema.Trim),
    Schema.compose(Schema.Lowercase),
    Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  ),
}) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(Email)(input);
  }

  static encode(value: Email) {
    return Schema.encode(Email)(value);
  }
}

export const EmailSchema = Schema.transform(
  Schema.String.pipe(
    Schema.compose(Schema.Trim),
    Schema.compose(Schema.Lowercase),
    Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  ),
  Email,
  {
    decode: (value) => new Email({ value }),
    encode: (email) => email.value,
  },
);
