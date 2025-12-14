import { Schema } from 'effect';

export class RevokeSessionsCommand extends Schema.TaggedClass<RevokeSessionsCommand>()('RevokeSessionsCommand', {
	sessionToken: Schema.optional(Schema.String),
	sessionIds: Schema.optional(Schema.Array(Schema.String)),
}) {
	static decode(input: unknown) {
		return Schema.decodeUnknown(RevokeSessionsCommand)(input);
	}

	static encode(value: RevokeSessionsCommand) {
		return Schema.encode(RevokeSessionsCommand)(value);
	}
}
