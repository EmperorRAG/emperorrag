import type * as Effect from "effect/Effect";
import type { PipelineContext } from "../../context/pipeline.context";
import type { AuthServerInputError } from "../../errors/authServer.error";

export interface HandleInputErrorProps {
  <T, R = never>(effect: Effect.Effect<T, unknown, R>): Effect.Effect<T, AuthServerInputError, R | PipelineContext>;
}
