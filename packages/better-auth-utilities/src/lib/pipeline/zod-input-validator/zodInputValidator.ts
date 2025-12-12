import * as Effect from 'effect/Effect';
import type { z } from 'zod';
import type { AuthServerApiEndpoints } from '../../enums/authServerApiEndpoints.enum';
import { type AuthServerInputError } from '../../server/core/shared/core.error';
import { createSchemaEffect } from '../handle-input-error/handleInputError';
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
	endpoint: AuthServerApiEndpoints
): Effect.Effect<T, AuthServerInputError, R> =>
	Effect.gen(function* () {
		const schema = yield* createSchemaEffect(schemaEffect, endpoint);
		const parsed = yield* parseWithSchemaEffect(schema, input, endpoint);
		const validated = yield* validateWithTypeGuardEffect(parsed, typeGuard, endpoint);
		return validated;
	});
