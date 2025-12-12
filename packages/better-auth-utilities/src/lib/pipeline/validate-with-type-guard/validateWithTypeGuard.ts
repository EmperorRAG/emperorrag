import * as Effect from 'effect/Effect';
import { PipelineContext } from '../../context/pipeline.context';
import { OperationCodes } from '../../enums/operationCodes.enum';
import { mapInputError } from '../map-input-error/mapInputError';
import type { ValidateWithTypeGuardProps } from './validateWithTypeGuard.types';

/**
 * Validates input with a type guard and returns an Effect.
 *
 * @pure
 * @description Applies a type guard to validated data and returns an Effect.
 * If the type guard fails, returns a traced AuthServerInputError.
 */

export const validateWithTypeGuard: ValidateWithTypeGuardProps = <T>(data: unknown, typeGuard: (value: unknown) => value is T) =>
	Effect.gen(function* () {
		const context = yield* PipelineContext;
		if (typeGuard(data)) {
			return yield* Effect.succeed(data);
		}

		const error = new Error('Data does not conform to expected structure');
		return yield* mapInputError(error).pipe(Effect.provideService(PipelineContext, { ...context, operationCode: OperationCodes.TypeGuardValidation() }));
	});
