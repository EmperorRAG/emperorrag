import * as Effect from 'effect/Effect';
import type { z } from 'zod';
import type { AuthServerApiEndpoints } from '../../enums/authServerApiEndpoints.enum';
import { OperationCodes } from '../../enums/operationCodes.enum';
import { mapInputError } from '../map-input-error/mapInputError';
import type { HandleInputErrorProps } from './handleInputError.types';

/**
 * Creates a schema creation Effect with proper error mapping.
 *
 * @pure
 * @description Wraps schema creation in an Effect that maps any errors to
 * AuthServerInputError with 'schema_creation' source for traceability.
 */

export const handleInputError: HandleInputErrorProps = <T extends z.ZodType, R = never>(
	schemaEffect: Effect.Effect<T, unknown, R>,
	endpoint: AuthServerApiEndpoints
) => Effect.catchAll(schemaEffect, (error) => mapInputError(error, OperationCodes.schemaCreation, endpoint));
