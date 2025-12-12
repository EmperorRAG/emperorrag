import type * as Effect from 'effect/Effect';
import type { z } from 'zod';
import type { AuthServerApiEndpoints } from '../../enums/authServerApiEndpoints.enum';
import type { AuthServerFor } from '../../server/server.types';

export interface CreateAuthServerApiEndpointParamsSchemaProps {
	<K extends AuthServerApiEndpoints>(endpoint: K): Effect.Effect<z.ZodSchema, Error, AuthServerFor>;
}
