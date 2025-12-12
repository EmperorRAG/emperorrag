import * as Effect from 'effect/Effect';
import { pipe } from 'effect/Function';
import { AuthServerApiError } from '../../errors/authServer.error';
import type { CreateAuthServerApiErrorProps } from './createAuthServerApiError.types';

/**
 * Creates a AuthServerApiError.
 *
 * @pure
 * @description Initializes a new AuthServerApiError wrapped in an Effect.
 */
export const createAuthServerApiError: CreateAuthServerApiErrorProps = (message, status, cause) =>
	pipe(
		Effect.succeed(message),
		Effect.map((msg) => new AuthServerApiError(msg, status, cause)),
		Effect.withSpan('createAuthServerApiError')
	);
