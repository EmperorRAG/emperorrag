import * as Effect from 'effect/Effect';
import type { z } from 'zod';
import type { AuthServerApiEndpoints } from '../../enums/authServerApiEndpoints.enum';
import { OperationCodes } from '../../enums/operationCodes.enum';
import { type CoreAuthServerInputError } from '../../server/core/shared/core.error';
import { mapBetterAuthInputErrorToCoreAuthError } from '../map-input-error/mapInputError';

/**
 * Creates a schema creation Effect with proper error mapping.
 *
 * @pure
 * @description Wraps schema creation in an Effect that maps any errors to
 * CoreAuthServerInputError with 'schema_creation' source for traceability.
 */

export const createSchemaEffect = <T extends z.ZodType, R = never>(
	schemaEffect: Effect.Effect<T, unknown, R>,
	endpoint: AuthServerApiEndpoints
): Effect.Effect<T, CoreAuthServerInputError, R> =>
	Effect.mapError(schemaEffect, (error) => mapBetterAuthInputErrorToCoreAuthError(error, OperationCodes.schemaCreation, endpoint));
