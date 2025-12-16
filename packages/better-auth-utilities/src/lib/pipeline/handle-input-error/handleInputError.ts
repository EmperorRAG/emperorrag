import * as Effect from "effect/Effect";
import { PipelineContext } from "../../context/pipeline.context";
import { OperationCodes } from "../../enums/operationCodes.enum";
import { mapInputError } from "../map-input-error/mapInputError";
import type { HandleInputErrorProps } from "./handleInputError.types";

/**
 * Creates a schema creation Effect with proper error mapping.
 *
 * @pure
 * @description Wraps schema creation in an Effect that maps any errors to
 * AuthServerInputError with 'schema_creation' source for traceability.
 */

export const handleInputError: HandleInputErrorProps = <T, R = never>(effect: Effect.Effect<T, unknown, R>) =>
  Effect.catchAll(
    effect,
    (error) =>
      Effect.flatMap(PipelineContext, (context) =>
        mapInputError(error).pipe(
          Effect.provideService(PipelineContext, { ...context, operationCode: OperationCodes.SchemaCreation() }),
        )),
  );
