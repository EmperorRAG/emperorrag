import type * as Effect from "effect/Effect";
import type { ApiError } from "../../errors/api.error";

export interface HandleApiErrorProps {
  <A, E, R>(
    effect: Effect.Effect<A, E, R>,
  ): Effect.Effect<A, ApiError, R>;
}
