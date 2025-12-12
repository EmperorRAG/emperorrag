import type * as Effect from 'effect/Effect';
import type { z } from 'zod';
import type { AuthServerApiEndpoints } from '../../enums/authServerApiEndpoints.enum';
import type { AuthServerInputError } from '../../errors/authServer.error';

export interface ZodInputValidatorProps {
	<T, R>(
		schemaEffect: Effect.Effect<z.ZodType, unknown, R>,
		input: unknown,
		typeGuard: (value: unknown) => value is T,
		endpoint: AuthServerApiEndpoints
	): Effect.Effect<T, AuthServerInputError, R>;
}
