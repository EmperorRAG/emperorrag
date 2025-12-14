import { Schema } from 'effect';
import { PasswordSchema } from '../../password.schema';

export class ResetPasswordCommand extends Schema.TaggedClass<ResetPasswordCommand>()('ResetPasswordCommand', {
	token: Schema.String,
	newPassword: PasswordSchema({ minLength: 8, maxLength: 100 }),
}) {
	static decode(input: unknown) {
		return Schema.decodeUnknown(ResetPasswordCommand)(input);
	}

	static encode(value: ResetPasswordCommand) {
		return Schema.encode(ResetPasswordCommand)(value);
	}
}
