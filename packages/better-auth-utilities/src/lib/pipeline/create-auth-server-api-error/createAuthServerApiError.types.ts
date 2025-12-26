import type * as Effect from "effect/Effect";
import type { AuthServerApiError } from "../../errors/authServer.error";

export interface CreateAuthServerApiErrorProps {
  (
    status?: number,
  ): (
    cause?: unknown,
  ) => (message: string) => Effect.Effect<AuthServerApiError, never, never>;
}
