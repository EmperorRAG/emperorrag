import * as Effect from 'effect/Effect';
import { pipe } from 'effect/Function';
import type { z } from 'zod';
import type { AuthServerApiEndpoints } from '../../enums/authServerApiEndpoints.enum';
import { OperationCodes } from '../../enums/operationCodes.enum';
import { type AuthServerInputError } from '../../errors/authServer.error';
import { mapInputError } from '../map-input-error/mapInputError';

/**
 * Parses input against a Zod schema and returns an Effect.
 *
 * @pure
 * @description Validates input against the provided schema and wraps the result
 * in an Effect. Failed validation returns a properly traced AuthServerInputError.
 */

export const parseWithSchemaEffect = <T>(schema: z.ZodType<T>, input: unknown, endpoint: AuthServerApiEndpoints): Effect.Effect<T, AuthServerInputError> =>
	Effect.suspend(() => {
		const result = schema.safeParse(input);

		if (result.success) {
			return Effect.succeed(result.data);
		}

		return pipe(mapInputError(result.error, OperationCodes.schemaParsing, endpoint), Effect.flatMap(Effect.fail));
	});
