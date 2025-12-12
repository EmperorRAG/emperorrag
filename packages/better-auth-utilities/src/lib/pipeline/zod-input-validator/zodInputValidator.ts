import * as Effect from 'effect/Effect';
import { pipe } from 'effect/Function';
import { handleInputError } from '../handle-input-error/handleInputError';
import { parseWithSchema } from '../parse-with-schema/parseWithSchema';
import { validateWithTypeGuard } from '../validate-with-type-guard/validateWithTypeGuard';
import type { ZodInputValidatorProps } from './zodInputValidator.types';

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

export const validateInputEffect: ZodInputValidatorProps = (schemaEffect, input, typeGuard) =>
	handleInputError(
		Effect.gen(function* () {
			const schema = yield* schemaEffect;
			const parsed = yield* parseWithSchema(schema, input);
			const validated = yield* pipe(parsed, validateWithTypeGuard(typeGuard));
			return validated;
		})
	);
