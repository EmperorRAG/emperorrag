import * as Effect from "effect/Effect";
import { pipe } from "effect/Function";
import * as Match from "effect/Match";
import * as ParseResult from "effect/ParseResult";
import { createAuthServerInputError } from "../create-auth-server-input-error/createAuthServerInputError";
import type { MapInputErrorProps } from "./mapInputError.types";

/**
 * Maps input validation errors to AuthServerInputError with full traceability.
 *
 * @pure
 * @description Converts various input validation error types (ParseError, Error)
 * into a standardized AuthServerInputError.
 */
export const mapInputError: MapInputErrorProps = (error) =>
  pipe(
    Match.value(error),
    Match.when(ParseResult.isParseError, (parseError) =>
      createAuthServerInputError(
        ParseResult.TreeFormatter.formatErrorSync(parseError),
        {
          originalError: parseError,
        },
      )),
    Match.when(Match.instanceOf(Error), (err) =>
      createAuthServerInputError(err.message, {
        originalError: err,
      })),
    Match.orElse((err) =>
      createAuthServerInputError("Input validation failed", {
        originalError: err,
      })
    ),
    Effect.flatMap(Effect.fail),
  );
