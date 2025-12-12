import type * as Effect from 'effect/Effect';
import type { PipelineContext } from '../../context/pipeline.context';
import type { AuthServerInputError } from '../../errors/authServer.error';

export interface ValidateWithTypeGuardProps {
	<T>(data: unknown, typeGuard: (value: unknown) => value is T): Effect.Effect<T, AuthServerInputError, PipelineContext>;
}
