import type * as Effect from "effect/Effect";
import type { InputError } from "../../errors/input.error";

export interface HandleInputErrorProps {
  <A, R = never>(
    effect: Effect.Effect<A, unknown, R>,
  ): Effect.Effect<A, InputError, R>;
}
