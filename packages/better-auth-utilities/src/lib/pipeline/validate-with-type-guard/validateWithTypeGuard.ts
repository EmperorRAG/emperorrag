import * as Either from 'effect/Either';
import type { ValidateWithTypeGuardProps } from './validateWithTypeGuard.types';

/**
 * Validates input with a type guard and returns an Either.
 *
 * @pure
 * @description Applies a type guard to validated data and returns an Either.
 * If the type guard fails, returns an Error.
 */

export const validateWithTypeGuard: ValidateWithTypeGuardProps =
	<T>(typeGuard: (value: unknown) => value is T) =>
	(data: unknown): Either.Either<Error, T> => {
		if (typeGuard(data)) {
			return Either.right(data) as Either.Either<Error, T>;
		}

		return Either.left(new Error('Data does not conform to expected structure')) as Either.Either<Error, T>;
	};
