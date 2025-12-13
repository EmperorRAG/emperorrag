import * as Schema from 'effect/Schema';

export const NameSchema = Schema.String.pipe(Schema.compose(Schema.Trim), Schema.minLength(1), Schema.brand('Name'));
export type Name = Schema.Schema.Type<typeof NameSchema>;
