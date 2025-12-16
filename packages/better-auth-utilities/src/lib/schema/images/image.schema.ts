import { Schema } from "effect";

export class Image extends Schema.TaggedClass<Image>()("Image", {
  value: Schema.String.pipe(Schema.compose(Schema.Trim), Schema.minLength(1)),
}) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(Image)(input);
  }

  static encode(value: Image) {
    return Schema.encode(Image)(value);
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
