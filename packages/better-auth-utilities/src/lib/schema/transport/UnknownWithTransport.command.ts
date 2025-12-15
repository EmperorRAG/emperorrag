import { Schema } from 'effect';
import { TransportCommand } from './Transport.command';

export class UnknownCommandWithTransportCommand extends Schema.TaggedClass<UnknownCommandWithTransportCommand>()('UnknownCommandWithTransportCommand', {
	command: Schema.Unknown,
	context: TransportCommand,
}) {
	static decode(input: unknown) {
		return Schema.decodeUnknown(UnknownCommandWithTransportCommand)(input);
	}

	static encode(value: UnknownCommandWithTransportCommand) {
		return Schema.encode(UnknownCommandWithTransportCommand)(value);
	}
}
