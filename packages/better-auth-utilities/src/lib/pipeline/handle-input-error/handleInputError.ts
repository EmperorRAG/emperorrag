import * as Effect from 'effect/Effect';
import { pipe } from 'effect/Function';
import type { z } from 'zod';
import type { AuthServerApiEndpoints } from '../../enums/authServerApiEndpoints.enum';
import { OperationCodes } from '../../enums/operationCodes.enum';
import { type AuthServerInputError } from '../../server/core/shared/core.error';
import { mapInputError } from '../map-input-error/mapInputError';

/**
 * Creates a schema creation Effect with proper error mapping.
 *
 * @pure
 * @description Wraps schema creation in an Effect that maps any errors to
 * AuthServerInputError with 'schema_creation' source for traceability.
 */

export const createSchemaEffect = <T extends z.ZodType, R = never>(
	schemaEffect: Effect.Effect<T, unknown, R>,
	endpoint: AuthServerApiEndpoints
): Effect.Effect<T, AuthServerInputError, R> =>
	Effect.catchAll(schemaEffect, (error) => pipe(mapInputError(error, OperationCodes.schemaCreation, endpoint), Effect.flatMap(Effect.fail)));
