import type * as Effect from "effect/Effect";
import type { z } from "zod";
import type { PipelineContext } from "../../context/pipeline.context";
import type { AuthServerFor } from "../../server/server.types";

export interface AuthServerApiEndpointBodyZodSchemaBuilderProps {
  (): Effect.Effect<z.ZodSchema, Error, AuthServerFor | PipelineContext>;
}
