import * as Effect from 'effect/Effect';
import { pipe } from 'effect/Function';
import * as Option from 'effect/Option';
import { AuthServerApiError } from '../../errors/authServer.error';
import type { CreateAuthServerApiErrorProps } from './createAuthServerApiError.types';

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
			pipe(
				Option.fromNullable(status),
				Option.match({
					onNone: () => new AuthServerApiError({ message: msg, cause }),
					onSome: (s) => new AuthServerApiError({ message: msg, cause, status: s }),
				})
			)
		),
		Effect.withSpan('createAuthServerApiError')
	);
