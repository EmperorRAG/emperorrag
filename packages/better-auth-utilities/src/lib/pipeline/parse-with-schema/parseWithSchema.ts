import * as Effect from 'effect/Effect';
import type { z } from 'zod';
import type { AuthServerApiEndpoints } from '../../enums/authServerApiEndpoints.enum';
import { OperationCodes } from '../../enums/operationCodes.enum';
import { mapInputError } from '../map-input-error/mapInputError';
import type { ParseWithSchemaProps } from './parseWithSchema.types';

/**
 * Parses input against a Zod schema and returns an Effect.
 *
 * @pure
 * @description Validates input against the provided schema and wraps the result
 * in an Effect. Failed validation returns a properly traced AuthServerInputError.
 */

export const parseWithSchema: ParseWithSchemaProps = <T>(schema: z.ZodType<T>, input: unknown, endpoint: AuthServerApiEndpoints) =>
	Effect.suspend(() => {
		const result = schema.safeParse(input);

		if (result.success) {
			return Effect.succeed(result.data);
		}

		return mapInputError(result.error, OperationCodes.schemaParsing, endpoint);
	});
