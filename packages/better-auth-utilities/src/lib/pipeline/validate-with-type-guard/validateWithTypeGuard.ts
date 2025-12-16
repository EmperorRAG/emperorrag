import * as Either from "effect/Either";
/**
 * Validates input with a type guard and returns an Either.
 *
 * @pure
 * @description Applies a type guard to validated data and returns an Either.
 * If the type guard fails, returns an Error.
 */
export const validateWithTypeGuard = <T>(typeGuard: (value: unknown) => value is T) =>
  Either.liftPredicate(typeGuard, () => new Error("Data does not conform to expected structure"));
