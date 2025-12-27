import { pipe } from "effect/Function";
import * as Schema from "effect/Schema";

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

  toJSON() {
    return Schema.encodeSync(Email)(this);
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
