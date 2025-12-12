import type * as Effect from 'effect/Effect';
import type { z } from 'zod';
import type { AuthServerApiEndpoints } from '../../enums/authServerApiEndpoints.enum';
import type { AuthServerInputError } from '../../errors/authServer.error';

export interface ParseWithSchemaProps {
	<T>(schema: z.ZodType<T>, input: unknown, endpoint: AuthServerApiEndpoints): Effect.Effect<T, AuthServerInputError>;
}
