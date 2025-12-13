import * as Effect from 'effect/Effect';
import * as Schema from 'effect/Schema';
import { AuthServerInputError } from '../../../../errors/authServer.error';

export const SignUpEmailCommandSchema = Schema.Struct({
	email: Schema.String,
	password: Schema.String,
	name: Schema.String,
	image: Schema.optional(Schema.String),
});

export type SignUpEmailCommand = Schema.Schema.Type<typeof SignUpEmailCommandSchema>;

export const decodeSignUpEmailCommand = (rawBody: unknown) =>
	Schema.decodeUnknown(SignUpEmailCommandSchema)(rawBody).pipe(Effect.mapError((e) => new AuthServerInputError({ message: 'Invalid body', cause: e })));
