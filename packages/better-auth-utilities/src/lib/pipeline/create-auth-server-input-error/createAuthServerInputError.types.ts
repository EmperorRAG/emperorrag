import type * as Effect from 'effect/Effect';
import type { AuthServerInputError } from '../../errors/authServer.error';

export interface CreateAuthServerInputErrorProps {
	(message: string, cause?: unknown): Effect.Effect<AuthServerInputError, never, never>;
}
