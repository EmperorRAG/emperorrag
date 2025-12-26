import { pipe } from "effect/Function";
import * as Match from "effect/Match";
import { map } from "effect/Array";
import { isValueArrayOfStringable } from "../types/array/array.types.js";
import { isValueObject } from "../types/object/object.types.js";
import type { Stringable } from "../types/stringable/stringable.types.js";

/**
 * Converts a single Stringable value to its string representation using pattern matching.
 *
 * @private
 * @pure
 * @param value The value to convert.
 * @returns The string representation of the value.
 *
 * @remarks
 * Pattern matching logic:
 * - If the value is an object with a custom toString method (not Object.prototype.toString), it calls that method.
 * - If the value is an object without a custom toString, it serializes the object using JSON.stringify.
 * - For all other cases (primitives, functions, etc.), it uses String(value).
 * Edge cases:
 * - Handles objects with overridden toString methods.
 * - Falls back to JSON.stringify for plain objects.
 * - Ensures all other types are stringified safely.
 */
const stringifyValue = (value: Stringable): string =>
  pipe(
    Match.value(value),
    Match.when(
      (v: Stringable): v is object =>
        isValueObject(v) &&
        typeof v.toString === "function" &&
        v.toString !== Object.prototype.toString,
      (v) => String(v),
    ),
    Match.when(isValueObject, (v) => JSON.stringify(v)),
    Match.orElse((v) => String(v)),
  );

/**
 * Converts an array of Stringable values to an array of strings.
 *
 * @pure This function is pure.
 * @description Overloaded function that converts a `Stringable` or `Stringable[]` to its string representation.
 *
 * @fp-pattern Pattern Matching, Higher-order function
 * @composition Uses `pipe` and `Match` to handle different input types.
 *   - For arrays, it maps over the array, applying `stringifyValue`.
 *   - For single values, it applies `stringifyValue` directly.
 *
 * @param value - An array of values to convert.
 * @returns An array of string representations for each element.
 *
 * @example
 * toString([1, 2, 3]); // => ["1", "2", "3"]
 */
export function toString(value: readonly Stringable[]): string[];
/**
 * Converts a single Stringable value to its string representation.
 *
 * @pure This function is pure.
 * @param value - The value to convert.
 * @returns The string representation of the value.
 *
 * @example
 * toString(42); // => "42"
 */
export function toString(value: Stringable): string;
export function toString(
  value: Stringable | readonly Stringable[],
): string | string[] {
  return pipe(
    Match.value(value),
    Match.when(isValueArrayOfStringable, (arr) =>
      pipe(arr, map(stringifyValue)),
    ),
    Match.orElse(stringifyValue),
  );
}
