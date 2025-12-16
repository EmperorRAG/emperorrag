import { Schema } from "effect";

export class Name extends Schema.TaggedClass<Name>()("Name", {
  value: Schema.String.pipe(Schema.compose(Schema.Trim), Schema.minLength(1)),
}) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(Name)(input);
  }

  static encode(value: Name) {
    return Schema.encode(Name)(value);
  }
}

export const NameSchema = Schema.transform(
  Schema.String.pipe(Schema.compose(Schema.Trim), Schema.minLength(1)),
  Name,
  {
    decode: (value) => new Name({ value }),
    encode: (name) => name.value,
  },
);
