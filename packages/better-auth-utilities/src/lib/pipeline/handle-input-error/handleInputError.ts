import * as Effect from "effect/Effect";
import { mapInputError } from "../map-input-error/mapInputError";
import type { HandleInputErrorProps } from "./handleInputError.types";

/**
 * Creates a schema creation Effect with proper error mapping.
 *
 * @pure
 * @description Wraps schema creation in an Effect that maps any errors to
 * InputError.
 */

export const handleInputError: HandleInputErrorProps = (
  effect,
) => Effect.catchAll(effect, mapInputError);
