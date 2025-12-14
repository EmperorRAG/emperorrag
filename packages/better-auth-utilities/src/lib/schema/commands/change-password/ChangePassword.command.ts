import { Schema } from 'effect';
import { PasswordSchema } from '../../password.schema';

export class ChangePasswordCommand extends Schema.TaggedClass<ChangePasswordCommand>()('ChangePasswordCommand', {
	currentPassword: PasswordSchema({ minLength: 1, maxLength: 100 }), // Current password validation might be looser or same
	newPassword: PasswordSchema({ minLength: 8, maxLength: 100 }),
	revokeOtherSessions: Schema.optional(Schema.Boolean),
}) {
	static decode(input: unknown) {
		return Schema.decodeUnknown(ChangePasswordCommand)(input);
	}

	static encode(value: ChangePasswordCommand) {
		return Schema.encode(ChangePasswordCommand)(value);
	}
}
