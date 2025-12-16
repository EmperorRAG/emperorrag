import { Schema } from "effect";

export class Url extends Schema.TaggedClass<Url>()("Url", {
  value: Schema.String.pipe(Schema.compose(Schema.Trim), Schema.minLength(1)),
}) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(Url)(input);
  }

  static encode(value: Url) {
    return Schema.encode(Url)(value);
  }
}

export const UrlSchema = Schema.transform(
  Schema.String.pipe(Schema.compose(Schema.Trim), Schema.minLength(1)),
  Url,
  {
    decode: (value) => new Url({ value }),
    encode: (url) => url.value,
  },
);
