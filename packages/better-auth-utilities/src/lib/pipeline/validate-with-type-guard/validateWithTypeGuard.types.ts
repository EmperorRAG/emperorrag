import type * as Effect from 'effect/Effect';
import type { AuthServerApiEndpoints } from '../../enums/authServerApiEndpoints.enum';
import type { AuthServerInputError } from '../../errors/authServer.error';

export interface ValidateWithTypeGuardProps {
	<T, AuthServerApiEndpoint extends AuthServerApiEndpoints = AuthServerApiEndpoints>(
		data: unknown,
		typeGuard: (value: unknown) => value is T,
		endpoint: AuthServerApiEndpoint
	): Effect.Effect<T, AuthServerInputError>;
}
