import * as Schema from 'effect/Schema';

export const ImageSchema = Schema.String.pipe(Schema.compose(Schema.Trim), Schema.minLength(1), Schema.brand('Image'));
export type Image = Schema.Schema.Type<typeof ImageSchema>;
