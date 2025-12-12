import * as Either from 'effect/Either';
import { pipe } from 'effect/Function';
import type { ParseWithSchemaProps } from './parseWithSchema.types';

/**
 * Parses input against a Zod schema and returns an Either.
 *
 * @pure
 * @description Validates input against the provided schema and returns an Either.
 * Failed validation returns a ZodError.
 */

export const parseWithSchema: ParseWithSchemaProps = (schema, input) =>
	pipe(schema.safeParse(input), (result) => (result.success ? Either.right(result.data) : Either.left(result.error)));
