import { pipe } from "effect/Function";
import * as Schema from "effect/Schema";

export class Url extends Schema.TaggedClass<Url>()("Url", {
  value: Schema.String.pipe(Schema.compose(Schema.Trim), Schema.minLength(1)),
}) {
  static decode(input: unknown) {
    return pipe(input, Schema.decodeUnknown(Url));
  }

  static encode(value: Url) {
    return pipe(value, Schema.encode(Url));
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
