import { Effect, ParseResult, Schema } from 'effect';
import { CommandWithTransport } from '../../transport/command-with-transport.schema';
import { SignUpEmailCommand } from './SignUpEmail.command';
import { SignUpEmailCommandWithTransport } from './SignUpEmailCommandWithTransport.schema';

export const CommandWithTransportToSignUpEmail = Schema.transformOrFail(CommandWithTransport, SignUpEmailCommandWithTransport, {
	decode: (input, options) => {
		return Schema.decodeUnknown(SignUpEmailCommand)(input.command).pipe(
			Effect.mapError((issue) => new ParseResult.Pointer('command', input.command, issue)),
			Effect.map(
				(command) =>
					new SignUpEmailCommandWithTransport({
						command,
						ctx: input.ctx,
					})
			)
		);
	},
	encode: (output) =>
		ParseResult.succeed(
			new CommandWithTransport({
				command: output.command,
				ctx: output.ctx,
			})
		),
});
