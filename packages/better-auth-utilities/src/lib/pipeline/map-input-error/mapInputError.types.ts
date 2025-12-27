import type * as Effect from "effect/Effect";
import type { InputError } from "../../errors/input.error";

export interface MapInputErrorProps {
  (error: unknown): Effect.Effect<never, InputError>;
}
