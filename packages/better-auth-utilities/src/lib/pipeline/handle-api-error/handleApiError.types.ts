import type * as Effect from "effect/Effect";
import type { AuthServerApiError } from "../../errors/authServer.error";

export interface HandleApiErrorProps {
  <A, E, R>(
    effect: Effect.Effect<A, E, R>,
  ): Effect.Effect<A, AuthServerApiError, R>;
}
