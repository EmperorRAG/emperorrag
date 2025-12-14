import { Schema } from 'effect';
import { TransportCtx } from '../../transport/transport-ctx.schema';
import { SignUpEmailCommand } from './SignUpEmail.command';

export class SignUpEmailCommandWithTransport extends Schema.TaggedClass<SignUpEmailCommandWithTransport>()('SignUpEmailCommandWithTransport', {
	command: SignUpEmailCommand,
	ctx: TransportCtx,
}) {
	static decode(input: unknown) {
		return Schema.decodeUnknown(SignUpEmailCommandWithTransport)(input);
	}

	static encode(value: SignUpEmailCommandWithTransport) {
		return Schema.encode(SignUpEmailCommandWithTransport)(value);
	}
}
