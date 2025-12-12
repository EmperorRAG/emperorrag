import type * as Either from 'effect/Either';
import type { z } from 'zod';

export interface ParseWithSchemaProps {
	<T>(schema: z.ZodType<T>): (input: unknown) => Either.Either<T, z.ZodError<T>>;
}
