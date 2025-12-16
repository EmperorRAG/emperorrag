import * as Effect from "effect/Effect";
import { mapApiError } from "../map-api-error/mapApiError";
import type { HandleApiErrorProps } from "./handleApiError.types";

/**
 * Wraps an Effect with proper API error mapping.
 *
 * @pure
 * @description Wraps an Effect that maps any errors to
 * AuthServerApiError.
 */
export const handleApiError: HandleApiErrorProps = (effect) => Effect.catchAll(effect, (error) => mapApiError(error));
