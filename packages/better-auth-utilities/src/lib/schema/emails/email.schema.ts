import * as Schema from "effect/Schema";

export const EmailSchema = Schema.String.pipe(
  Schema.compose(Schema.Trim),
  Schema.compose(Schema.Lowercase),
  Schema.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  Schema.brand("Email"),
);
export type Email = Schema.Schema.Type<typeof EmailSchema>;
