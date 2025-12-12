import type * as Effect from 'effect/Effect';
import type { z } from 'zod';

export interface ParseWithSchemaProps {
	<T>(schema: z.ZodType<T>, input: unknown): Effect.Effect<T, z.ZodError>;
}
