import type * as Effect from 'effect/Effect';
import type { z } from 'zod';
import type { PipelineContext } from '../../context/pipeline.context';
import type { AuthServerInputError } from '../../errors/authServer.error';

export interface HandleInputErrorProps {
	<T extends z.ZodType, R = never>(schemaEffect: Effect.Effect<T, unknown, R>): Effect.Effect<T, AuthServerInputError, R | PipelineContext>;
}
