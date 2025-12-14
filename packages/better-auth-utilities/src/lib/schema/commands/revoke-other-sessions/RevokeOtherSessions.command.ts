import { Schema } from 'effect';

export class RevokeOtherSessionsCommand extends Schema.TaggedClass<RevokeOtherSessionsCommand>()('RevokeOtherSessionsCommand', {}) {
	static decode(input: unknown) {
		return Schema.decodeUnknown(RevokeOtherSessionsCommand)(input);
	}

	static encode(value: RevokeOtherSessionsCommand) {
		return Schema.encode(RevokeOtherSessionsCommand)(value);
	}
}
