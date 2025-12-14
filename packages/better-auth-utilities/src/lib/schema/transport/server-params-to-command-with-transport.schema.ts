import { Effect, ParseResult, Schema } from 'effect';
import { SignUpEmailAuthServer } from '../commands/sign-up-email/SignUpEmail.adapters';
import { SignUpEmailCommand } from '../commands/sign-up-email/SignUpEmail.command';
import { CommandWithTransport } from './command-with-transport.schema';
import { TransportCtx } from './transport-ctx.schema';

export const ServerParamsToCommandWithTransport = Schema.transformOrFail(SignUpEmailAuthServer, CommandWithTransport, {
	decode: (input) =>
		ParseResult.succeed(
			new CommandWithTransport({
				command: input.body,
				ctx: new TransportCtx({
					headers: input.headers,
					asResponse: input.asResponse,
					returnHeaders: input.returnHeaders,
				}),
			})
		),
	encode: (output) =>
		Schema.decodeUnknown(SignUpEmailCommand)(output.command).pipe(
			Effect.mapError((issue) => new ParseResult.Pointer('command', output.command, issue.issue)),
			Effect.map(
				(body) =>
					new SignUpEmailAuthServer({
						body,
						headers: output.ctx.headers,
						asResponse: output.ctx.asResponse,
						returnHeaders: output.ctx.returnHeaders,
					})
			)
		),
});
