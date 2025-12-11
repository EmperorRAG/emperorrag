import * as Effect from 'effect/Effect';
import type { z } from 'zod';
import { type CoreAuthServerInputError, mapBetterAuthInputErrorToCoreAuthError } from '../../server/core/shared/core.error';

/**
 * Creates a schema creation Effect with proper error mapping.
 *
 * @pure
 * @description Wraps schema creation in an Effect that maps any errors to
 * CoreAuthServerInputError with 'schema_creation' source for traceability.
 */

export const createSchemaEffect = <T extends z.ZodType, R = never>(
	schemaEffect: Effect.Effect<T, unknown, R>,
	operation: string
): Effect.Effect<T, CoreAuthServerInputError, R> =>
	Effect.mapError(schemaEffect, (error) => mapBetterAuthInputErrorToCoreAuthError(error, 'schema_creation', operation));
