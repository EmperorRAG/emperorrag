/**
 * Utilities for declaring Rollup externals in a functional style.
 */

import { pipe } from 'effect/Function';

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
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

/**
 * Coerces an unknown value into a readonly string array when possible.
 *
 * @pure
 * @description Filters non-string entries to guarantee matcher integrity.
 */
const ensureStringArray = (value: unknown): ReadonlyArray<string> | undefined =>
	pipe(value, (candidate) => (Array.isArray(candidate) ? candidate.filter((item): item is string => typeof item === 'string') : undefined));

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
 * Creates a Rollup external matcher function from the provided configuration.
 *
 * @pure
 * @description Composes exact, prefix, and substring checks into a single predicate.
 */
export const externalizePackages =
	(config: ExternalizeConfig) =>
	(id: string): boolean => {
		const isExact = config.exact?.includes(id) ?? false;
		const isStartsWith = config.startsWith?.some((prefix) => id.startsWith(prefix)) ?? false;
		const isIncludes = config.includes?.some((substring) => id.includes(substring)) ?? false;

		return isExact || isStartsWith || isIncludes;
	};
