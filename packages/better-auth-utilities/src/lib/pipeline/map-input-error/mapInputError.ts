import * as Effect from "effect/Effect";
import { pipe } from "effect/Function";
import * as Match from "effect/Match";
import * as ParseResult from "effect/ParseResult";
import { InputError } from "../../errors/input.error";
import type { MapInputErrorProps } from "./mapInputError.types";

/**
 * Maps input validation errors to InputError with full traceability.
 *
 * @pure
 * @description Converts various input validation error types (ParseError, Error)
 * into a standardized InputError.
 */
export const mapInputError: MapInputErrorProps = (error: unknown) =>
  pipe(
    Match.value(error),
    Match.when(ParseResult.isParseError, (parseError) =>
      new InputError({
        message: ParseResult.TreeFormatter.formatErrorSync(parseError),
        cause: parseError,
      })),
    Match.when(Match.instanceOf(Error), (err) =>
      new InputError({
        message: err.message,
        cause: err,
      })),
    Match.orElse((err) =>
      new InputError({
        message: "Input validation failed",
        cause: err,
      })
    ),
    Effect.fail,
  );
