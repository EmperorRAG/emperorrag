import { APIError } from 'better-auth';
import * as Effect from 'effect/Effect';
import { pipe } from 'effect/Function';
import * as Match from 'effect/Match';
import { AuthServerApiError } from '../../errors/authServer.error';
import { createAuthServerApiError } from '../create-auth-server-api-error/createAuthServerApiError';
import type { MapApiErrorProps } from './mapApiError.types';

export const mapApiError: MapApiErrorProps = (error) =>
	pipe(
		Match.value(error as any),
		Match.tag('APIError', (err) => {
			const apiError = err as unknown as APIError;
			const status = typeof apiError.status === 'number' ? apiError.status : parseInt(apiError.status as string, 10) || undefined;
			return createAuthServerApiError(apiError.message, status, apiError);
		}),
		Match.when(Match.instanceOf(Error), (err) => createAuthServerApiError(err.message, undefined, err)),
		Match.orElse((err) => createAuthServerApiError('Unknown auth server error', undefined, err)),
		(effect) => effect as Effect.Effect<AuthServerApiError>,
		Effect.flatMap(Effect.fail)
	);
