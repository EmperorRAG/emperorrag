import { Schema } from 'effect';
import { CommandWithTransport } from './command-with-transport.schema';
import { TransportCtx } from './transport-ctx.schema';

const ServerParamsInput = Schema.Struct({
	body: Schema.Unknown,
	headers: Schema.optional(Schema.instanceOf(Headers)),
	asResponse: Schema.optional(Schema.Boolean),
	returnHeaders: Schema.optional(Schema.Boolean),
});

export const ServerParamsToCommandWithTransport = Schema.transform(ServerParamsInput, CommandWithTransport, {
	decode: (input) =>
		new CommandWithTransport({
			command: input.body,
			ctx: new TransportCtx({
				headers: input.headers,
				asResponse: input.asResponse,
				returnHeaders: input.returnHeaders,
			}),
		}),
	encode: (output) => ({
		body: output.command,
		headers: output.ctx.headers,
		asResponse: output.ctx.asResponse,
		returnHeaders: output.ctx.returnHeaders,
	}),
});
