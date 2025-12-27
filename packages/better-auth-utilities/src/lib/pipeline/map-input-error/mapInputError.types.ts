import type * as Effect from "effect/Effect";
import type { AuthServerInputError } from "../../errors/authServer.error";

export interface MapInputErrorProps {
  (error: unknown): Effect.Effect<never, AuthServerInputError>;
}
