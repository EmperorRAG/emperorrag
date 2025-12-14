import { Schema } from 'effect';

export class UnlinkAccountCommand extends Schema.TaggedClass<UnlinkAccountCommand>()('UnlinkAccountCommand', {
	providerId: Schema.String,
}) {
	static decode(input: unknown) {
		return Schema.decodeUnknown(UnlinkAccountCommand)(input);
	}

	static encode(value: UnlinkAccountCommand) {
		return Schema.encode(UnlinkAccountCommand)(value);
	}
}
