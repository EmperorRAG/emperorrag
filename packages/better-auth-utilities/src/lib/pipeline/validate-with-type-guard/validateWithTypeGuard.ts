import * as Effect from 'effect/Effect';
import { pipe } from 'effect/Function';
import type { AuthServerApiEndpoints } from '../../enums/authServerApiEndpoints.enum';
import { OperationCodes } from '../../enums/operationCodes.enum';
import { type CoreAuthServerInputError } from '../../server/core/shared/core.error';
import { mapInputError } from '../map-input-error/mapInputError';

/**
 * Validates input with a type guard and returns an Effect.
 *
 * @pure
 * @description Applies a type guard to validated data and returns an Effect.
 * If the type guard fails, returns a traced CoreAuthServerInputError.
 */

export const validateWithTypeGuardEffect = <T, AuthServerApiEndpoint extends AuthServerApiEndpoints = AuthServerApiEndpoints>(
	data: unknown,
	typeGuard: (value: unknown) => value is T,
	endpoint: AuthServerApiEndpoint
): Effect.Effect<T, CoreAuthServerInputError> =>
	Effect.suspend(() => {
		if (typeGuard(data)) {
			return Effect.succeed(data);
		}

		const error = new Error('Data does not conform to expected structure');
		return pipe(mapInputError(error, OperationCodes.typeGuardValidation, endpoint), Effect.flatMap(Effect.fail));
	});
