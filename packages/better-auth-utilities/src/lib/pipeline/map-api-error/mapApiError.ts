import { APIError } from 'better-auth';
import { pipe } from 'effect/Function';
import * as Match from 'effect/Match';
import { AuthServerApiError } from '../../errors/authServer.error';
export const mapApiError = (error: unknown): AuthServerApiError =>
	pipe(
		Match.value(error),
		Match.when(Match.instanceOf(APIError), (err) => {
			const status = typeof err.status === 'number' ? err.status : parseInt(err.status as string, 10) || undefined;
			return new AuthServerApiError(err.message, status, err);
		}),
		Match.when(Match.instanceOf(Error), (err) => new AuthServerApiError(err.message, undefined, err)),
		Match.orElse((err) => new AuthServerApiError('Unknown auth server error', undefined, err))
	);
