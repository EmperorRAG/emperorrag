import { Schema } from 'effect';
import { EmailSchema } from '../../email.schema';
import { PasswordSchema } from '../../password.schema';
import { UrlSchema } from '../../url.schema';

export class SignInEmailCommand extends Schema.TaggedClass<SignInEmailCommand>()('SignInEmailCommand', {
	email: EmailSchema,
	password: PasswordSchema({ minLength: 8, maxLength: 100 }),
	callbackURL: Schema.optional(UrlSchema),
}) {
	static decode(input: unknown) {
		return Schema.decodeUnknown(SignInEmailCommand)(input);
	}

	static encode(value: SignInEmailCommand) {
		return Schema.encode(SignInEmailCommand)(value);
	}
}
