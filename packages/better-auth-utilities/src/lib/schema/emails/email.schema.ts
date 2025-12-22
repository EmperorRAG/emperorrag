import { Schema } from "effect";
import { pipe } from "effect/Function";

export class Email extends Schema.TaggedClass<Email>()("Email", {
  value: Schema.String.pipe(
    Schema.compose(Schema.Trim),
    Schema.compose(Schema.Lowercase),
    Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  ),
}) {
  static decode(input: unknown) {
    return pipe(input, Schema.decodeUnknown(Email));
  }

  static encode(value: Email) {
    return pipe(value, Schema.encode(Email));
  }
}

/*export const EmailSchema = Schema.transform(
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
);*/
