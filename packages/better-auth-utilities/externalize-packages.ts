/**
 * Utilities for declaring Rollup externals in a functional style.
 */

import { pipe } from "effect/Function";

/**
 * Configuration describing how module identifiers should be externalized.
 */
export type ExternalizeConfig = Readonly<{
  readonly exact?: ReadonlyArray<string>;
  readonly startsWith?: ReadonlyArray<string>;
  readonly includes?: ReadonlyArray<string>;
}>;

/**
 * Determines whether the provided value is a record of unknown keys.
 *
 * @pure
 * @description Guards runtime values before attempting to read matcher properties.
 */
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

/**
 * Coerces an unknown value into a readonly string array when possible.
 *
 * @pure
 * @description Filters non-string entries to guarantee matcher integrity.
 */
const ensureStringArray = (value: unknown): ReadonlyArray<string> | undefined =>
  pipe(value, (candidate) =>
    Array.isArray(candidate)
      ? candidate.filter((item): item is string => typeof item === "string")
      : undefined);

/**
 * Safely converts untyped JSON input into the expected externalization config.
 *
 * @pure
 * @description Provides a defensive layer around deserialized matcher objects.
 */
export const toExternalizeConfig = (input: unknown): ExternalizeConfig =>
  pipe(input, (candidate) => {
    if (!isRecord(candidate)) {
      return {};
    }

    const exact = ensureStringArray(candidate.exact);
    const startsWith = ensureStringArray(candidate.startsWith);
    const includes = ensureStringArray(candidate.includes);

    return {
      ...(exact ? { exact } : {}),
      ...(startsWith ? { startsWith } : {}),
      ...(includes ? { includes } : {}),
    };
  });

/**
 * Normalizes the provided configuration arrays for the external matcher.
 *
 * @pure
 * @description Creates immutable matcher lists with normalized separators.
 */
const createNormalizedConfig = (
  config: ExternalizeConfig,
): Readonly<{
  readonly exact: ReadonlyArray<string>;
  readonly startsWith: ReadonlyArray<string>;
  readonly includes: ReadonlyArray<string>;
}> => ({
  exact: toNormalizedArray(config.exact),
  startsWith: toNormalizedArray(config.startsWith),
  includes: toNormalizedArray(config.includes),
});

/**
 * Ensures forward-slash path separators regardless of the runtime platform.
 *
 * @pure
 * @description Normalizes path separators for consistent matcher evaluation.
 */
const normalizePath = (value: string): string => value.replace(/\\/g, "/");

/**
 * Converts an optional array into a normalized readonly array.
 *
 * @pure
 * @description Normalizes each entry in the provided collection while preserving order.
 */
const toNormalizedArray = (
  values: ReadonlyArray<string> | undefined,
): ReadonlyArray<string> => pipe(values ?? [], (entries) => Array.from(entries, normalizePath));

/**
 * Evaluates whether any pattern in the collection matches according to the provided comparison.
 *
 * @pure
 * @description Applies the supplied comparison to every pattern until a match is found.
 */
const matchAny = (
  patterns: ReadonlyArray<string>,
  compare: (pattern: string) => boolean,
): boolean => pipe(patterns, (entries) => entries.some(compare));

/**
 * Creates an external predicate for Rollup based on declared package matchers.
 *
 * @pure
 * @description Normalizes matcher paths and returns a curried predicate that checks module ids.
 *
 * @fp-pattern Curried function
 * @composition
 *   - `pipe(config.exact ?? [], (entries) => Array.from(entries, normalizePath))`
 *   - `pipe(config.startsWith ?? [], (entries) => Array.from(entries, normalizePath))`
 *   - `pipe(config.includes ?? [], (entries) => Array.from(entries, normalizePath))`
 *
 * @param config - External matcher configuration.
 * @returns {(id: string) => boolean} Predicate that reports whether the module id should be externalized.
 *
 * @example
 * const predicate = externalizePackages({ exact: ['better-auth'], startsWith: ['better-auth/'] });
 * const result = predicate('better-auth/plugins');
 * // => true
 */
export const externalizePackages = (
  config: ExternalizeConfig,
): (id: string) => boolean => {
  const normalizedConfig = createNormalizedConfig(config);

  return (id: string): boolean => {
    const normalizedId = normalizePath(id);

    return (
      matchAny(normalizedConfig.exact, (pattern) => normalizedId === pattern)
      || matchAny(normalizedConfig.startsWith, (pattern) => normalizedId.startsWith(pattern))
      || matchAny(normalizedConfig.includes, (pattern) => normalizedId.includes(pattern))
    );
  };
};
