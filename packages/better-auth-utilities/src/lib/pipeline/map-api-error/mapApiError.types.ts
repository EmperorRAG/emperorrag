import type * as Effect from 'effect/Effect';
import type { AuthServerApiError } from '../../errors/authServer.error';

export interface MapApiErrorProps {
	(error: unknown): Effect.Effect<never, AuthServerApiError>;
}
