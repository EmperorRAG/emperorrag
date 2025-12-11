import * as Effect from 'effect/Effect';
import type { z } from 'zod';
import { type CoreAuthServerInputError } from '../../server/core/shared/core.error';
import { createSchemaEffect } from '../map-input-error/mapInputError';
import { parseWithSchemaEffect } from '../parse-with-schema/parseWithSchema';
import { validateWithTypeGuardEffect } from '../validate-with-type-guard/validateWithTypeGuard';

/**
 * Composes schema creation, parsing, and type guard validation into a single Effect.
 *
 * @pure
 * @description Creates a complete validation pipeline that:
 * 1. Creates the schema (with error tracing)
 * 2. Parses input against the schema (with error tracing)
 * 3. Validates with type guard (with error tracing)
 *
 * Each step in the pipeline produces a traceable error if it fails,
 * enabling precise identification of where validation failed.
 */

export const validateInputEffect = <T, R>(
	schemaEffect: Effect.Effect<z.ZodType, unknown, R>,
	input: unknown,
	typeGuard: (value: unknown) => value is T,
	operation: string
): Effect.Effect<T, CoreAuthServerInputError, R> =>
	Effect.gen(function* () {
		const schema = yield* createSchemaEffect(schemaEffect, operation);
		const parsed = yield* parseWithSchemaEffect(schema, input, operation);
		const validated = yield* validateWithTypeGuardEffect(parsed, typeGuard, operation);
		return validated;
	});
