import type * as Effect from "effect/Effect";
import type { AuthServerErrorDescriptor } from "../describe-error/describeError.types";

export interface WithServerErrorHandlerProps {
  <A, E, R>(
    effect: Effect.Effect<A, E, R>,
  ): Effect.Effect<A, AuthServerErrorDescriptor, R>;
}
