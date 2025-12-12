import type * as Effect from 'effect/Effect';
import type { z } from 'zod';
import type { PipelineContext } from '../../context/pipeline.context';
import type { AuthServerInputError } from '../../errors/authServer.error';

export interface ZodInputValidatorProps {
	<T, R>(
		schemaEffect: Effect.Effect<z.ZodType, unknown, R>,
		input: unknown,
		typeGuard: (value: unknown) => value is T
	): Effect.Effect<T, AuthServerInputError, R | PipelineContext>;
}
