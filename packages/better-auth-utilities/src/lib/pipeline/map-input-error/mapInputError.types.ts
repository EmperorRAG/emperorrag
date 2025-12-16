import type * as Effect from "effect/Effect";
import type { PipelineContext } from "../../context/pipeline.context";
import type { AuthServerApiEndpoints } from "../../enums/authServerApiEndpoints.enum";
import type { OperationCodes } from "../../enums/operationCodes.enum";
import type { AuthServerInputError } from "../../errors/authServer.error";

export interface MapInputErrorProps {
  (error: unknown): Effect.Effect<never, AuthServerInputError, PipelineContext>;
}

/**
 * Detailed input validation error with source tracing.
 *
 * @pure
 * @description Contains structured information about input validation failures,
 * including the source of the error, field-level details, and the original cause.
 */

export interface CoreInputValidationDetails {
  readonly operationCode: OperationCodes;
  readonly endpoint: AuthServerApiEndpoints;
  readonly fieldErrors?: ReadonlyArray<{ path: string; message: string }>;
}
