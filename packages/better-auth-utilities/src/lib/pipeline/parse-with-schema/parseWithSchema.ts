import * as Effect from 'effect/Effect';
import type { z } from 'zod';
import { PipelineContext } from '../../context/pipeline.context';
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

export const parseWithSchema: ParseWithSchemaProps = <T>(schema: z.ZodType<T>, input: unknown) =>
	Effect.gen(function* () {
		const context = yield* PipelineContext;
		const result = schema.safeParse(input);

		if (result.success) {
			return yield* Effect.succeed(result.data);
		}

		return yield* mapInputError(result.error).pipe(Effect.provideService(PipelineContext, { ...context, operationCode: OperationCodes.schemaParsing }));
	});
