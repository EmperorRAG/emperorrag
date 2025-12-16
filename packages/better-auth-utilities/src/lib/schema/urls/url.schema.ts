import * as Schema from "effect/Schema";

export const UrlSchema = Schema.String.pipe(Schema.compose(Schema.Trim), Schema.minLength(1), Schema.brand("Url"));
export type Url = Schema.Schema.Type<typeof UrlSchema>;
