import * as Effect from 'effect/Effect';
import type { z } from 'zod';
import type { ParseWithSchemaProps } from './parseWithSchema.types';

/**
 * Parses input against a Zod schema and returns an Effect.
 *
 * @pure
 * @description Validates input against the provided schema and wraps the result
 * in an Effect. Failed validation returns a ZodError.
 */

export const parseWithSchema: ParseWithSchemaProps = <T>(schema: z.ZodType<T>, input: unknown) => {
	const result = schema.safeParse(input);

	if (result.success) {
		return Effect.succeed(result.data);
	}

	return Effect.fail(result.error);
};
