import { Schema } from 'effect';
import { SignUpEmailCommand } from './SignUpEmail.command';

export class SignUpEmailAuthServer extends Schema.TaggedClass<SignUpEmailAuthServer>()('SignUpEmailAuthServer', {
	body: SignUpEmailCommand,
	headers: Schema.optional(Schema.instanceOf(Headers)),
	asResponse: Schema.optional(Schema.Boolean),
	returnHeaders: Schema.optional(Schema.Boolean),
}) {
	static decode(input: unknown) {
		return Schema.decodeUnknown(SignUpEmailAuthServer)(input);
	}

	static encode(value: SignUpEmailAuthServer) {
		return Schema.encode(SignUpEmailAuthServer)(value);
	}
}
