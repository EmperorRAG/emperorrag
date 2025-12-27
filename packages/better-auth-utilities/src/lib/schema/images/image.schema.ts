import { pipe } from "effect/Function";
import * as Schema from "effect/Schema";

export class Image extends Schema.TaggedClass<Image>()("Image", {
  value: Schema.String.pipe(Schema.compose(Schema.Trim), Schema.minLength(1)),
}) {
  static decode(input: unknown) {
    return pipe(input, Schema.decodeUnknown(Image));
  }

  static encode(value: Image) {
    return pipe(value, Schema.encode(Image));
  }
}

export const ImageSchema = Schema.transform(
  Schema.String.pipe(Schema.compose(Schema.Trim), Schema.minLength(1)),
  Image,
  {
    decode: (value) => new Image({ value }),
    encode: (image) => image.value,
  },
);
