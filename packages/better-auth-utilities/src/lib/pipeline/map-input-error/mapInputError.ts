import * as Array from "effect/Array";
import * as Effect from "effect/Effect";
import { pipe } from "effect/Function";
import * as Match from "effect/Match";
import type { z } from "zod";
import { PipelineContext } from "../../context/pipeline.context";
import { AuthServerInputError } from "../../errors/authServer.error";
import { createAuthServerInputError } from "../create-auth-server-input-error/createAuthServerInputError";
import { formatZodErrorMessage } from "../format-zod-error-message/formatZodErrorMessage";
import type { MapInputErrorProps } from "./mapInputError.types";

/**
 * Maps input validation errors to AuthServerInputError with full traceability.
 *
 * @pure
 * @description Converts various input validation error types (ZodError, type guard failures,
 * schema creation errors) into a standardized AuthServerInputError with detailed
 * traceability information about where in the workflow the error occurred.
 */

export const mapInputError: MapInputErrorProps = (error) =>
  Effect.gen(function* () {
    const { operationCode, endpoint } = yield* PipelineContext;
    if (!operationCode) {
      return yield* Effect.dieMessage("Operation code is required in PipelineContext for mapInputError");
    }

    return yield* Match.value(error as unknown).pipe(
      Match.tag("ZodError", (err) => {
        const zodError = err as unknown as z.ZodError;
        return pipe(
          formatZodErrorMessage(zodError),
          Effect.flatMap((message) =>
            createAuthServerInputError(message, {
              zodError: zodError,
              details: {
                operationCode,
                endpoint,
                fieldErrors: pipe(
                  zodError.issues,
                  Array.map((issue) => ({
                    path: pipe(issue.path, Array.map(String), Array.join(".")),
                    message: issue.message,
                  })),
                ),
              },
            })
          ),
        );
      }),
      Match.when(Match.instanceOf(Error), (err) =>
        createAuthServerInputError(err.message, {
          originalError: err,
          details: { operationCode, endpoint },
        })),
      Match.orElse((err) =>
        createAuthServerInputError(`Invalid ${endpoint} parameters: ${operationCode._tag} failed`, {
          originalError: err,
          details: { operationCode, endpoint },
        })
      ),
      (effect) => effect as Effect.Effect<AuthServerInputError>,
      Effect.flatMap(Effect.fail),
    );
  });
