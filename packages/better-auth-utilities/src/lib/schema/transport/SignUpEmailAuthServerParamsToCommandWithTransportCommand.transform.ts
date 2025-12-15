import { Effect, ParseResult, Schema } from 'effect';
import { SignUpEmailCommand } from '../commands/sign-up-email/SignUpEmail.command';
import { SignUpEmailAuthServerParams } from '../commands/sign-up-email/SignUpEmailAuthServer.params';
import { TransportCommand } from './Transport.command';
import { UnknownCommandWithTransportCommand } from './UnknownWithTransport.command';

export const SignUpEmailAuthServerParamsToCommandWithTransportCommandTransform = Schema.transformOrFail(
	SignUpEmailAuthServerParams,
	UnknownCommandWithTransportCommand,
	{
		decode: (input) =>
			ParseResult.succeed(
				new UnknownCommandWithTransportCommand({
					command: input.body,
					context: new TransportCommand({
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
						new SignUpEmailAuthServerParams({
							body,
							headers: output.context.headers,
							asResponse: output.context.asResponse,
							returnHeaders: output.context.returnHeaders,
						})
				)
			),
	}
);
