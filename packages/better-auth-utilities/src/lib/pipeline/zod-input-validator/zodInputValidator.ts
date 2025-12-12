import * as Effect from 'effect/Effect';
import type { z } from 'zod';
import { PipelineContext } from '../../context/pipeline.context';
import { OperationCodes } from '../../enums/operationCodes.enum';
import { handleInputError } from '../handle-input-error/handleInputError';
import { mapInputError } from '../map-input-error/mapInputError';
import { parseWithSchema } from '../parse-with-schema/parseWithSchema';
import { validateWithTypeGuard } from '../validate-with-type-guard/validateWithTypeGuard';
import type { ZodInputValidatorProps } from './zodInputValidator.types';

/**
 * Composes schema creation, parsing, and type guard validation into a single Effect.
 *
 * @pure
 * @description Creates a complete validation pipeline that:
 * 1. Creates the schema (with error tracing)
 * 2. Parses input against the schema (with error tracing)
 * 3. Validates with type guard (with error tracing)
 *
 * Each step in the pipeline produces a traceable error if it fails,
 * enabling precise identification of where validation failed.
 */

export const validateInputEffect: ZodInputValidatorProps = <T, R>(
	schemaEffect: Effect.Effect<z.ZodType, unknown, R>,
	input: unknown,
	typeGuard: (value: unknown) => value is T
) =>
	Effect.gen(function* () {
		const schema = yield* handleInputError(schemaEffect);
		const parsed = yield* parseWithSchema(schema, input).pipe(
			Effect.catchAll((zodError) =>
				Effect.flatMap(PipelineContext, (ctx) =>
					mapInputError(zodError).pipe(Effect.provideService(PipelineContext, { ...ctx, operationCode: OperationCodes.SchemaParsing() }))
				)
			)
		);
		const validated = yield* validateWithTypeGuard(parsed, typeGuard);
		return validated;
	});
