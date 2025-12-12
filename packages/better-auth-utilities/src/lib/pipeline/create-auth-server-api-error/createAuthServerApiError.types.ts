import type * as Effect from 'effect/Effect';
import type { AuthServerApiError } from '../../errors/authServer.error';

export interface CreateAuthServerApiErrorProps {
	(message: string, status?: number, cause?: unknown): Effect.Effect<AuthServerApiError, never, never>;
}
