import type * as Either from "effect/Either";

export interface ValidateWithTypeGuardProps {
  <T>(typeGuard: (value: unknown) => value is T): (data: unknown) => Either.Either<T, Error>;
}
