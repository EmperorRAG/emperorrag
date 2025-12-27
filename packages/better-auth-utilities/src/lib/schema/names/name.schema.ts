import { pipe } from "effect/Function";
import * as Schema from "effect/Schema";

export class Name extends Schema.TaggedClass<Name>()("Name", {
  value: Schema.String.pipe(Schema.compose(Schema.Trim), Schema.minLength(1)),
}) {
  static decode(input: unknown) {
    return pipe(input, Schema.decodeUnknown(Name));
  }

  static encode(value: Name) {
    return pipe(value, Schema.encode(Name));
  }

  toJSON() {
    return Schema.encodeSync(Name)(this);
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
