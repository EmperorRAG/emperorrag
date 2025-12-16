import type * as Effect from "effect/Effect";
import type { z } from "zod";
import type { PipelineContext } from "../../context/pipeline.context";
import type { AuthServerInputError } from "../../errors/authServer.error";

export type ZodInputValidatorProps = <R>(
  schemaEffect: Effect.Effect<z.ZodType, unknown, R>,
) => <T>(
  typeGuard: (value: unknown) => value is T,
) => (
  input: unknown,
) => Effect.Effect<T, AuthServerInputError, R | PipelineContext>;
