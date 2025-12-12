import * as Effect from 'effect/Effect';
import { pipe } from 'effect/Function';
import * as Match from 'effect/Match';
import { AuthServerApiError } from '../../errors/authServer.error';
import type { CreateAuthServerApiErrorProps } from './createAuthServerApiError.types';

const isDefined = <T>(value: T | undefined): value is T => value !== undefined;

/**
 * Creates a AuthServerApiError.
 *
 * @pure
 * @description Initializes a new AuthServerApiError wrapped in an Effect.
 */
export const createAuthServerApiError: CreateAuthServerApiErrorProps = (status) => (cause) => (message) =>
	pipe(
		Effect.succeed(message),
		Effect.map((msg) =>
			Match.value({ status, cause }).pipe(
				Match.when(
					(ctx): ctx is { status: number; cause: unknown } => isDefined(ctx.status) && isDefined(ctx.cause),
					({ status, cause }) => new AuthServerApiError({ message: msg, status, cause })
				),
				Match.when(
					(ctx): ctx is { status: number; cause: undefined } => isDefined(ctx.status),
					({ status }) => new AuthServerApiError({ message: msg, status })
				),
				Match.when(
					(ctx): ctx is { status: undefined; cause: unknown } => isDefined(ctx.cause),
					({ cause }) => new AuthServerApiError({ message: msg, cause })
				),
				Match.orElse(() => new AuthServerApiError({ message: msg }))
			)
		),
		Effect.withSpan('createAuthServerApiError')
	);
