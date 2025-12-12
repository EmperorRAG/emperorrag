import { APIError } from 'better-auth';
import * as Effect from 'effect/Effect';
import { pipe } from 'effect/Function';
import * as Match from 'effect/Match';
import type { AuthServerApiError } from '../../errors/authServer.error';
import { createAuthServerApiError } from '../create-auth-server-api-error/createAuthServerApiError';

export const mapApiError = (error: unknown): Effect.Effect<never, AuthServerApiError> =>
	pipe(
		Match.value(error),
		Match.when(Match.instanceOf(APIError), (err) => {
			const status = typeof err.status === 'number' ? err.status : parseInt(err.status as string, 10) || undefined;
			return createAuthServerApiError(err.message, status, err);
		}),
		Match.when(Match.instanceOf(Error), (err) => createAuthServerApiError(err.message, undefined, err)),
		Match.orElse((err) => createAuthServerApiError('Unknown auth server error', undefined, err)),
		Effect.flatMap(Effect.fail)
	);
