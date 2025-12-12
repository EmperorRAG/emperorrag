import type * as Effect from 'effect/Effect';
import type { z } from 'zod';
import type { PipelineContext } from '../../context/pipeline.context';
import type { AuthServerInputError } from '../../errors/authServer.error';

export interface ParseWithSchemaProps {
	<T>(schema: z.ZodType<T>, input: unknown): Effect.Effect<T, AuthServerInputError, PipelineContext>;
}
