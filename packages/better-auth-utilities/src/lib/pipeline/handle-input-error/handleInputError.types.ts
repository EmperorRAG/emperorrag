import type * as Effect from 'effect/Effect';
import type { z } from 'zod';
import type { AuthServerApiEndpoints } from '../../enums/authServerApiEndpoints.enum';
import type { AuthServerInputError } from '../../errors/authServer.error';

export interface HandleInputErrorProps {
	<T extends z.ZodType, R = never>(schemaEffect: Effect.Effect<T, unknown, R>, endpoint: AuthServerApiEndpoints): Effect.Effect<T, AuthServerInputError, R>;
}
