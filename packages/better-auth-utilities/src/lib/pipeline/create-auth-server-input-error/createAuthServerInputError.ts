import * as Effect from 'effect/Effect';
import { pipe } from 'effect/Function';
import { CoreAuthServerInputError } from '../../server/core/shared/core.error';

/**
 * Creates a CoreAuthServerInputError.
 *
 * @pure
 * @description Initializes a new CoreAuthServerInputError wrapped in an Effect.
 */
export const createAuthServerInputError = (message: string, cause?: unknown) =>
	pipe(
		Effect.succeed(message),
		Effect.map((msg) => new CoreAuthServerInputError(msg, cause)),
		Effect.withSpan('createAuthServerInputError')
	);
