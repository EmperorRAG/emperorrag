import { Schema } from 'effect';
import { TransportCommand } from '../../transport/Transport.command';
import { SignUpEmailCommand } from './SignUpEmail.command';

export class SignUpEmailCommandWithTransportCommand extends Schema.TaggedClass<SignUpEmailCommandWithTransportCommand>()(
	'SignUpEmailCommandWithTransportCommand',
	{
		command: SignUpEmailCommand,
		ctx: TransportCommand,
	}
) {
	static decode(input: unknown) {
		return Schema.decodeUnknown(SignUpEmailCommandWithTransportCommand)(input);
	}

	static encode(value: SignUpEmailCommandWithTransportCommand) {
		return Schema.encode(SignUpEmailCommandWithTransportCommand)(value);
	}
}
