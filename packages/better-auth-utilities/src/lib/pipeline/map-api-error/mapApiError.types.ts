import type * as Effect from "effect/Effect";
import type { ApiError } from "../../errors/api.error";

export interface MapApiErrorProps {
  (error: unknown): Effect.Effect<never, ApiError>;
}
