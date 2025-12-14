import { Schema } from 'effect';

export class TransportCtx extends Schema.TaggedClass<TransportCtx>()('TransportCtx', {
	headers: Schema.optional(Schema.instanceOf(Headers)),
	asResponse: Schema.optional(Schema.Boolean),
	returnHeaders: Schema.optional(Schema.Boolean),
}) {
	static decode(input: unknown) {
		return Schema.decodeUnknown(TransportCtx)(input);
	}

	static encode(value: TransportCtx) {
		return Schema.encode(TransportCtx)(value);
	}
}
