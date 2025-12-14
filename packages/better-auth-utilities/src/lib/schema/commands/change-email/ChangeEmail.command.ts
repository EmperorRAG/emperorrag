import { Schema } from 'effect';
import { EmailSchema } from '../../email.schema';
import { UrlSchema } from '../../url.schema';

export class ChangeEmailCommand extends Schema.TaggedClass<ChangeEmailCommand>()('ChangeEmailCommand', {
	newEmail: EmailSchema,
	callbackURL: Schema.optional(UrlSchema),
}) {
	static decode(input: unknown) {
		return Schema.decodeUnknown(ChangeEmailCommand)(input);
	}

	static encode(value: ChangeEmailCommand) {
		return Schema.encode(ChangeEmailCommand)(value);
	}
}
