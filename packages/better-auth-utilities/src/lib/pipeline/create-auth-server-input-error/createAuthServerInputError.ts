import * as Effect from 'effect/Effect';
import { pipe } from 'effect/Function';
import { AuthServerInputError } from '../../server/core/shared/core.error';

/**
 * Creates a AuthServerInputError.
 *
 * @pure
 * @description Initializes a new AuthServerInputError wrapped in an Effect.
 */
export const createAuthServerInputError = (message: string, cause?: unknown) =>
	pipe(
		Effect.succeed(message),
		Effect.map((msg) => new AuthServerInputError(msg, cause)),
		Effect.withSpan('createAuthServerInputError')
	);
