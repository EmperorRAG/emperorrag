import { Schema } from 'effect';
import { TransportCtx } from './transport-ctx.schema';

export class CommandWithTransport extends Schema.TaggedClass<CommandWithTransport>()('CommandWithTransport', {
	command: Schema.Unknown,
	ctx: TransportCtx,
}) {
	static decode(input: unknown) {
		return Schema.decodeUnknown(CommandWithTransport)(input);
	}

	static encode(value: CommandWithTransport) {
		return Schema.encode(CommandWithTransport)(value);
	}
}
